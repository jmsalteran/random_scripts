import "dotenv/config";
import { logger } from "../../shared/utils/logger";
import {
  CreateBusinessEntityInput,
  Entity,
  CreateUserInput,
  RoutefusionBusiness,
  RoutefusionUser,
  EntityRequiredFields,
  RepresentativeRequiredFields,
  EntityRequiredFieldsQueryInput,
  RepresentativeRequiredFieldsQueryInput,
  EntityValidationResult,
  RepresentativeValidationResult,
  BusinessType,
  EntityType,
  ISO3166_1,
  BeneficiaryRequiredFields,
  BeneficiaryRequiredFieldsQueryInput,
  BeneficiaryValidationResult,
} from "./types/entity.types";
import {
  CreateWalletInput,
  AddBalanceToWalletInput,
  CreateVirtualAccountInput,
  CreateTransferInput,
  GraphQLResponse,
  Wallet,
  VirtualAccount,
  BusinessEntity,
  RoutefusionGraphQLError,
  UploadBusinessEntityDocumentInput,
  UploadRepresentativeDocumentInput,
  UploadDocumentResponse,
  CreateRepresentativeInput,
  UpdateRepresentativeInput,
  CreatePersonalBeneficiaryInput,
  CreateBusinessBeneficiaryInput,
  Transfer,
  FinalizeTransferInput,
} from "./types/service.types";

export class RoutefusionService {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor() {
    this.apiKey =
      process.env.ROTEFUSION_API_KEY || process.env.ROUTEFUSION_API_KEY || "";

    if (!this.apiKey) {
      throw new Error(
        "ROTEFUSION_API_KEY or ROUTEFUSION_API_KEY environment variable is required"
      );
    }

    // Default to sandbox, can be overridden with env variable
    this.baseURL =
      process.env.ROUTEFUSION_API_URL ||
      "https://sandbox.external.routefusion.com/graphql";
  }

  /**
   * Execute a GraphQL query or mutation
   */
  private async executeGraphQL<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `[RoutefusionService] HTTP error: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Routefusion API HTTP error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const responseData: GraphQLResponse<T> = await response.json();

      if (responseData.errors && responseData.errors.length > 0) {
        const errorMessages = responseData.errors
          .map((e) => e.message)
          .join(", ");
        logger.error(`[RoutefusionService] GraphQL errors: ${errorMessages}`);
        throw new RoutefusionGraphQLError(responseData.errors);
      }

      if (!responseData.data) {
        throw new Error("No data returned from GraphQL response");
      }

      logger.info(`[RoutefusionService] Request successful`);
      return responseData.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`[RoutefusionService] Request failed: ${error.message}`);
        throw error;
      }
      throw new Error(`Routefusion API error: ${String(error)}`);
    }
  }

  /**
   * Create a user
   * Returns the user object from the mutation Ex: { routefusionUserID: '11b24079-3ad3-4b4c-a488-1d7707f95186' }
   */
  async createUser(
    input: CreateUserInput
  ): Promise<{ routefusionUserID: string }> {
    const createUserMutation = `
      mutation createUser (
          $email: Email!
          $first_name: String
          $last_name: String
          $admin: Boolean
          $send_invite_email: Boolean
      ) {
          createUser (
              email: $email
              first_name: $first_name
              last_name: $last_name
              admin: $admin
              send_invite_email: $send_invite_email
          )
      }
    `;
    try {
      const result = await this.executeGraphQL<{ routefusionUserID: string }>(
        createUserMutation,
        input
      );
      return result;
    } catch (error) {
      logger.error(`[RoutefusionService] Error creating user: ${error}`);
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<RoutefusionUser> {
    try {
      const query = `
        query User($userId: UUID!) {
          user(id: $userId) {
            id
            identifier
            email
            first_name
            last_name
            admin
            role
            organization {
              id
              identifier
              admin
              restricted
              enabled
              mandatory_mfa
              created_date
            }
            created_date
            created_by
            last_invite_sent_at
            created_at
            invite_accepted
            last_login
            disabled
            main_org_disabled
          }
        }
      `;
      const result = await this.executeGraphQL<{ user: RoutefusionUser }>(
        query,
        { userId: userId }
      );
      return result.user;
    } catch (error) {
      logger.error(`[RoutefusionService] Error getting user: ${error}`);
      throw error;
    }
  }

  /**
   * Create a business entity
   * Returns the entity ID (UUID) from the mutation
   */
  async createBusinessEntity(
    input: CreateBusinessEntityInput
  ): Promise<string> {
    try {
      const mutation = `
      mutation createBusinessEntity(
        $user_id: UUID
        $email: Email!
        $phone: String
        $phone_country: String
        $contact_first_name: String!
        $contact_last_name: String!
        $business_name: String!
        $business_address1: String!
        $business_address2: String
        $business_city: String
        $business_state_province_region: String
        $business_postal_code: PostalCode
        $business_country: ISO3166_1!
        $business_type: BusinessType
        $tax_number: TaxNumber
        $naics_code: NAICS
        $business_description: String
        $trading_symbol: String
        $owned_by: String
        $incorporation_date: DateTime
        $accept_terms_and_conditions: Boolean!
        $average_monthly_transaction_count: String
        $average_monthly_volume: String
        $website_url: String
      ) {
        createBusinessEntity(
          user_id: $user_id
          email: $email
          phone: $phone
          phone_country: $phone_country
          contact_first_name: $contact_first_name
          contact_last_name: $contact_last_name
          business_name: $business_name
          business_address1: $business_address1
          business_address2: $business_address2
          business_city: $business_city
          business_state_province_region: $business_state_province_region
          business_postal_code: $business_postal_code
          business_country: $business_country
          business_type: $business_type
          tax_number: $tax_number
          accept_terms_and_conditions: $accept_terms_and_conditions
          naics_code: $naics_code
          business_description: $business_description
          trading_symbol: $trading_symbol
          owned_by: $owned_by
          incorporation_date: $incorporation_date
          average_monthly_transaction_count: $average_monthly_transaction_count
          average_monthly_volume: $average_monthly_volume
          website_url: $website_url
        )
      }
    `;

      const result = await this.executeGraphQL<{
        createBusinessEntity: string;
      }>(mutation, input);

      const entityId = result.createBusinessEntity;
      logger.info(`[RoutefusionService] Created business entity: ${entityId}`);
      return entityId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Execute a GraphQL mutation with file upload (multipart/form-data)
   */
  private async executeGraphQLFileUpload<T>(
    operations: string,
    map: Record<string, string[]>,
    file: File | Blob | Buffer
  ): Promise<T> {
    try {
      const formData = new FormData();

      // Add operations (the GraphQL mutation)
      formData.append("operations", operations);

      // Add map (maps file variables to file parts)
      formData.append("map", JSON.stringify(map));

      // Add the file
      // Determine the filename based on file type
      let filename = "test-document.txt";
      if (file instanceof File) {
        filename = file.name;
      }

      // In Node.js, FormData.append accepts Blob/Buffer with filename as third parameter
      formData.append("0", file as any, filename);

      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "x-apollo-operation-name": "singleUpload",
          // Don't set Content-Type header - let fetch set it with boundary for multipart/form-data
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `[RoutefusionService] HTTP error: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Routefusion API HTTP error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const responseData: GraphQLResponse<T> = await response.json();

      if (responseData.errors && responseData.errors.length > 0) {
        const errorMessages = responseData.errors
          .map((e) => e.message)
          .join(", ");
        logger.error(`[RoutefusionService] GraphQL errors: ${errorMessages}`);
        throw new RoutefusionGraphQLError(responseData.errors);
      }

      if (!responseData.data) {
        throw new Error("No data returned from GraphQL response");
      }

      logger.info(`[RoutefusionService] File upload successful`);
      return responseData.data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `[RoutefusionService] File upload failed: ${error.message}`
        );
        throw error;
      }
      throw new Error(`Routefusion API error: ${String(error)}`);
    }
  }

  /**
   * Upload an entity document
   */
  async uploadEntityDocument(
    input: UploadBusinessEntityDocumentInput
  ): Promise<UploadDocumentResponse> {
    try {
      const operations = JSON.stringify({
        query: `
          mutation singleUpload($file: Upload!) {
            singleUpload(
              file: $file
              entity_id: "${input.entityId}"
              file_enum: ${input.file_enum}
            ) {
              filename
            }
          }
        `,
        variables: {
          file: null,
        },
      });

      const map = {
        "0": ["variables.file"],
      };

      const result = await this.executeGraphQLFileUpload<{
        singleUpload: UploadDocumentResponse;
      }>(operations, map, input.file);

      logger.info(
        `[RoutefusionService] Uploaded document: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
      return result.singleUpload;
    } catch (error) {
      logger.error(`[RoutefusionService] Error uploading document: ${error}`);
      throw error;
    }
  }

  /**
   * Upload a document for a representative
   */
  async uploadRepresentativeDocument(
    input: UploadRepresentativeDocumentInput
  ): Promise<UploadDocumentResponse> {
    try {
      const operations = JSON.stringify({
        query: `
          mutation singleUpload($file: Upload!) {
            singleUpload(
              file: $file
              representative_id: "${input.representativeId}"
              file_enum: ${input.file_enum}
            ) {
              filename
            }
          }
        `,
        variables: {
          file: null,
        },
      });

      const map = {
        "0": ["variables.file"],
      };

      const result = await this.executeGraphQLFileUpload<{
        singleUpload: UploadDocumentResponse;
      }>(operations, map, input.file);

      logger.info(
        `[RoutefusionService] Uploaded representative document: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
      return result.singleUpload;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error uploading representative document: ${error}`
      );
      throw error;
    }
  }

  /**
   * Finalize a business entity
   * Indicates the entity is ready to execute the onboarding process.
   * Once finalized, Routefusion will send the entity through compliance reviews.
   * The entity will immediately move to a pending state after finalizing.
   * Reference: https://docs.routefusion.com/reference/finalize-entity
   */
  async finalizeEntity(entityId: string): Promise<string> {
    try {
      const mutation = `
        mutation finalizeEntity($entity_id: UUID!) {
          finalizeEntity(entity_id: $entity_id) {
              success
              error
              validations {
                  id
                  resource
                  message
                  missingKeys
              }
          }
        }
      `;

      const result = await this.executeGraphQL<{
        finalizeEntity: string;
      }>(mutation, { entity_id: entityId });

      logger.info(
        `[RoutefusionService] Finalized entity: ${result.finalizeEntity}`
      );
      return result.finalizeEntity;
    } catch (error) {
      logger.error(`[RoutefusionService] Error finalizing entity: ${error}`);
      throw error;
    }
  }

  /**
   * Create a representative for a business entity
   * Reference: https://docs.routefusion.com/reference/create-representative
   */
  async createRepresentative(
    input: CreateRepresentativeInput
  ): Promise<string> {
    try {
      const mutation = `
        mutation createRepresentative(
          $entity_id: UUID!
          $document_expiration_date: DateTime
          $document_issue_date: DateTime
          $document_number: String
          $citizenship: ISO3166_1
          $date_of_birth: DateTime
          $email: Email
          $first_name: String
          $is_signer: Boolean
          $last_name: String
          $job_title: String
          $ownership_percentage: Int
          $passport_number: String
          $phone: String
          $residential_address: String
          $residential_address2: String
          $residential_city: String
          $residential_country: ISO3166_1
          $residential_postal_code: PostalCode
          $residential_state_province_region: String
          $responsibility: String
          $tax_number: TaxNumber
        ) {
          createRepresentative(
            entity_id: $entity_id
            representative: {
              document_expiration_date: $document_expiration_date
              document_issue_date: $document_issue_date
              document_number: $document_number
              citizenship: $citizenship
              date_of_birth: $date_of_birth
              email: $email
              first_name: $first_name
              is_signer: $is_signer
              last_name: $last_name
              job_title: $job_title
              ownership_percentage: $ownership_percentage
              passport_number: $passport_number
              phone: $phone
              residential_address: $residential_address
              residential_address2: $residential_address2
              residential_city: $residential_city
              residential_country: $residential_country
              residential_postal_code: $residential_postal_code
              residential_state_province_region: $residential_state_province_region
              responsibility: $responsibility
              tax_number: $tax_number
            }
          )
        }
      `;

      const { entity_id, representative } = input;
      const result = await this.executeGraphQL<{
        createRepresentative: string;
      }>(mutation, {
        entity_id,
        document_expiration_date: representative.document_expiration_date,
        document_issue_date: representative.document_issue_date,
        document_number: representative.document_number,
        citizenship: representative.citizenship,
        date_of_birth: representative.date_of_birth,
        email: representative.email,
        first_name: representative.first_name,
        is_signer: representative.is_signer,
        last_name: representative.last_name,
        job_title: representative.job_title,
        ownership_percentage: representative.ownership_percentage
          ? Math.round(representative.ownership_percentage)
          : undefined,
        passport_number: representative.passport_number,
        phone: representative.phone,
        residential_address: representative.residential_address,
        residential_address2: representative.residential_address2,
        residential_city: representative.residential_city,
        residential_country: representative.residential_country,
        residential_postal_code: representative.residential_postal_code,
        residential_state_province_region:
          representative.residential_state_province_region,
        responsibility: representative.responsibility,
        tax_number: representative.tax_number,
      });

      logger.info(
        `[RoutefusionService] Created representative: ${result.createRepresentative}`
      );
      return result.createRepresentative;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error creating representative: ${error}`
      );
      throw error;
    }
  }

  /**
   * Update a representative for a business entity
   * Reference: https://docs.routefusion.com/reference/update-representative
   */
  async updateRepresentative(
    input: UpdateRepresentativeInput
  ): Promise<boolean> {
    try {
      const mutation = `
        mutation updateRepresentative(
          $id: UUID!
          $document_expiration_date: DateTime
          $document_issue_date: DateTime
          $document_number: String
          $citizenship: ISO3166_1
          $date_of_birth: DateTime
          $email: Email
          $first_name: String
          $is_signer: Boolean
          $last_name: String
          $job_title: String
          $ownership_percentage: Int
          $passport_number: String
          $phone: String
          $residential_address: String
          $residential_address2: String
          $residential_city: String
          $residential_country: ISO3166_1
          $residential_postal_code: PostalCode
          $residential_state_province_region: String
          $responsibility: String
          $tax_number: TaxNumber
        ) {
          updateRepresentative(
            id: $id
            representative: {
              document_expiration_date: $document_expiration_date
              document_issue_date: $document_issue_date
              document_number: $document_number
              citizenship: $citizenship
              date_of_birth: $date_of_birth
              email: $email
              first_name: $first_name
              is_signer: $is_signer
              last_name: $last_name
              job_title: $job_title
              ownership_percentage: $ownership_percentage
              passport_number: $passport_number
              phone: $phone
              residential_address: $residential_address
              residential_address2: $residential_address2
              residential_city: $residential_city
              residential_country: $residential_country
              residential_postal_code: $residential_postal_code
              residential_state_province_region: $residential_state_province_region
              responsibility: $responsibility
              tax_number: $tax_number
            }
          )
        }
      `;

      const { updateRepresentativeId, representative } = input;
      const result = await this.executeGraphQL<{
        updateRepresentative: boolean;
      }>(mutation, {
        id: updateRepresentativeId,
        document_expiration_date: representative.document_expiration_date,
        document_issue_date: representative.document_issue_date,
        document_number: representative.document_number,
        citizenship: representative.citizenship,
        date_of_birth: representative.date_of_birth,
        email: representative.email,
        first_name: representative.first_name,
        is_signer: representative.is_signer,
        last_name: representative.last_name,
        job_title: representative.job_title,
        ownership_percentage: representative.ownership_percentage
          ? Math.round(representative.ownership_percentage)
          : undefined,
        passport_number: representative.passport_number,
        phone: representative.phone,
        residential_address: representative.residential_address,
        residential_address2: representative.residential_address2,
        residential_city: representative.residential_city,
        residential_country: representative.residential_country,
        residential_postal_code: representative.residential_postal_code,
        residential_state_province_region:
          representative.residential_state_province_region,
        responsibility: representative.responsibility,
        tax_number: representative.tax_number,
      });

      logger.info(
        `[RoutefusionService] Updated representative: ${result.updateRepresentative}`
      );
      return result.updateRepresentative;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error updating representative: ${error}`
      );
      throw error;
    }
  }

  /**
   * Delete a representative from an entity
   * This may only be done before finalizing the entity.
   * Reference: https://docs.routefusion.com/reference/delete-representative
   */
  async deleteRepresentative(representativeId: string): Promise<boolean> {
    try {
      const mutation = `
        mutation deleteRepresentative($deleteRepresentativeId: UUID!) {
          deleteRepresentative(id: $deleteRepresentativeId)
        }
      `;

      const result = await this.executeGraphQL<{
        deleteRepresentative: boolean;
      }>(mutation, {
        deleteRepresentativeId: representativeId,
      });

      logger.info(
        `[RoutefusionService] Deleted representative: ${representativeId}`
      );
      return result.deleteRepresentative;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error deleting representative: ${error}`
      );
      throw error;
    }
  }

  /**
   * Get a business entity by ID
   */
  async getBusinessEntity(businessId: string): Promise<RoutefusionBusiness> {
    try {
      const query = `
        query entity (
            $businessId: UUID!
        ) {
            entity (
                entity_id: $businessId
            ) {
                id
                type
                business_name
                first_name
                last_name
                state
                email
                phone
                address1
                address2
                city
                state_province_region
                postal_code
                country
                representatives {
                    first_name
                    last_name
                    date_of_birth
                    is_signer
                    residential_address
                    residential_address2
                    residential_city
                    residential_state_province_region
                    residential_postal_code
                    residential_country
                    citizenship
                    responsibility
                    ownership_percentage
                    email
                    phone
                    job_title
                    passport_number
                }
                creator {
                    id
                    identifier
                    email
                    first_name
                    last_name
                    admin
                }
                users {
                    id
                    identifier
                    email
                    first_name
                    last_name
                    admin
                }
            }
        }
      `;
      const result = await this.executeGraphQL<{ entity: RoutefusionBusiness }>(
        query,
        { businessId: businessId }
      );
      return result.entity;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error getting business entity: ${error}`
      );
      throw error;
    }
  }

  /**
   * Finalize a business entity
   */
  async finalizeBusinessEntity(businessId: string): Promise<void> {}

  /**
   * Create a wallet for an entity
   */
  async createWallet(input: CreateWalletInput): Promise<Wallet> {
    try {
      const mutation = `
        mutation createWallet (
            $entityId: UUID!
            $currency: ISO4217!
        ) {
            createWallet (
                entity_id: $entityId
                currency: $currency
            )
        }
      `;

      const result = await this.executeGraphQL<{ createWallet: string }>(
        mutation,
        { entityId: input.entityId, currency: input.currency }
      );

      const walletId = result.createWallet;
      logger.info(`[RoutefusionService] Created wallet with ID: ${walletId}`);

      // Fetch the full wallet details
      const wallet = await this.getWallet(walletId);
      return wallet;
    } catch (error) {
      logger.error(`[RoutefusionService] Error creating wallet: ${error}`);
      throw error;
    }
  }

  /**
   * Add balance to a wallet
   * Reference: https://docs.routefusion.com/reference/mutations-6
   */
  async addBalanceToWallet(input: AddBalanceToWalletInput): Promise<boolean> {
    try {
      const mutation = `
        mutation addBalanceToWallet(
          $wallet_id: UUID!
          $amount: String!
        ) {
          addBalanceToWallet(
            wallet_id: $wallet_id
            amount: $amount
          )
        }
      `;

      const result = await this.executeGraphQL<{
        addBalanceToWallet: boolean;
      }>(mutation, {
        wallet_id: input.wallet_id,
        amount: input.amount,
      });

      logger.info(
        `[RoutefusionService] Added balance ${input.amount} to wallet ${input.wallet_id}`
      );
      return result.addBalanceToWallet;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error adding balance to wallet: ${error}`
      );
      throw error;
    }
  }

  /**
   * Create a virtual account (named virtual bank account) for a wallet
   */
  async createVirtualAccount(
    input: CreateVirtualAccountInput
  ): Promise<VirtualAccount> {
    const mutation = `
      mutation createVirtualAccount($input: CreateVirtualAccountInput!) {
        createVirtualAccount(input: $input) {
          id
          wallet_id
          name
          account_number
          routing_number
          currency
        }
      }
    `;

    const result = await this.executeGraphQL<{
      createVirtualAccount: VirtualAccount;
    }>(mutation, { input });

    logger.info(
      `[RoutefusionService] Created virtual account: ${result.createVirtualAccount.id} (${result.createVirtualAccount.name})`
    );
    if (result.createVirtualAccount.account_number) {
      logger.info(
        `[RoutefusionService] Account Number: ${result.createVirtualAccount.account_number}`
      );
      logger.info(
        `[RoutefusionService] Routing Number: ${
          result.createVirtualAccount.routing_number || "N/A"
        }`
      );
    }
    return result.createVirtualAccount;
  }

  /**
   * Get a virtual account by ID
   */
  async getVirtualAccount(virtualAccountId: string): Promise<VirtualAccount> {
    const query = `
      query getVirtualAccount($id: ID!) {
        virtualAccount(id: $id) {
          id
          wallet_id
          name
          account_number
          routing_number
          currency
        }
      }
    `;

    const result = await this.executeGraphQL<{
      virtualAccount: VirtualAccount;
    }>(query, { id: virtualAccountId });

    return result.virtualAccount;
  }

  /**
   * Get all virtual accounts for an organization (paginated)
   */
  async getOrganizationVirtualAccounts(
    page?: number,
    pageSize?: number
  ): Promise<{ virtualAccounts: VirtualAccount[]; total?: number }> {
    const query = `
      query getOrganizationVirtualAccounts($page: Int, $pageSize: Int) {
        organizationVirtualAccountsPage(page: $page, pageSize: $pageSize) {
          virtualAccounts {
            id
            wallet_id
            name
            account_number
            routing_number
            currency
          }
          total
        }
      }
    `;

    const result = await this.executeGraphQL<{
      organizationVirtualAccountsPage: {
        virtualAccounts: VirtualAccount[];
        total: number;
      };
    }>(query, { page, pageSize });

    return {
      virtualAccounts: result.organizationVirtualAccountsPage.virtualAccounts,
      total: result.organizationVirtualAccountsPage.total,
    };
  }

  /**
   * Get wallet by ID
   */
  async getWallet(walletId: string): Promise<Wallet> {
    const query = `
      query getWallet($id: ID!) {
        wallet(id: $id) {
          id
          entity_id
          currency
          balance
        }
      }
    `;

    const result = await this.executeGraphQL<{ wallet: Wallet }>(query, {
      id: walletId,
    });

    return result.wallet;
  }

  /**
   * Get entity by ID
   */
  async getEntity(entityId: string): Promise<Entity> {
    const query = `
      query getEntity($entity_id: UUID!) {
        entity(entity_id: $entity_id) {
          id
          type
          entity_name
          business_name
          first_name
          last_name
          contact_first_name
          contact_last_name
          state
          email
          phone
          phone_country
          address1
          address2
          city
          state_province_region
          postal_code
          country
          created_date
          tax_number
          trade_name
          naics_code
          currency_needed
          destination_countries
          business_type
          business_industry
          business_description
          trading_symbol
          owned_by
          owned_by_other_entity
          owned_by_public_company
          owned_by_public_company_symbol
          incorporation_date
          document_expiration_date
          website_url
        }
      }
    `;

    const result = await this.executeGraphQL<{ entity: Entity }>(query, {
      entity_id: entityId,
    });

    return result.entity;
  }

  /**
   * Get required fields for an entity based on country, entity type, and business type
   * Reference: https://docs.routefusion.com/reference/entity-required-fields
   */
  async getEntityRequiredFields(
    input?: EntityRequiredFieldsQueryInput
  ): Promise<EntityRequiredFields> {
    try {
      const query = `
        query entityRequiredFields(
          $country: ISO3166_1
          $entity_type: EntityType
          $business_type: BusinessType
        ) {
          entityRequiredFields(
            country: $country
            entity_type: $entity_type
            business_type: $business_type
          ) {
            requires_representatives
            documents {
              enum
              type
            }
            fields {
              variable
              regex
              example
              enum
            }
          }
        }
      `;

      const result = await this.executeGraphQL<{
        entityRequiredFields: EntityRequiredFields;
      }>(query, {
        country: input?.country,
        entity_type: input?.entity_type,
        business_type: input?.business_type,
      });

      logger.info(`[RoutefusionService] Retrieved entity required fields`);
      return result.entityRequiredFields;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error getting entity required fields: ${error}`
      );
      throw error;
    }
  }

  /**
   * Get required fields for a representative based on country, entity type, and business type
   * Reference: https://docs.routefusion.com/reference/representative-required-fields
   */
  async getRepresentativeRequiredFields(
    input?: RepresentativeRequiredFieldsQueryInput
  ): Promise<RepresentativeRequiredFields> {
    try {
      const query = `
        query representativeRequiredFields(
          $country: ISO3166_1
        ) {
          representativeRequiredFields(
            country: $country
          ) {
            documents {
              enum
              type
            }
            fields {
              variable
              regex
              example
              enum
            }
          }
        }
      `;

      const result = await this.executeGraphQL<{
        representativeRequiredFields: RepresentativeRequiredFields;
      }>(query, {
        country: input?.country,
      });

      logger.info(
        `[RoutefusionService] Retrieved representative required fields`
      );
      return result.representativeRequiredFields;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error getting representative required fields: ${error}`
      );
      throw error;
    }
  }

  /**
   * Get required fields for a beneficiary based on bank country, currency, and beneficiary country
   * Reference: https://docs.routefusion.com/reference/beneficiary-required-fields
   */
  async getBeneficiaryRequiredFields(
    input: BeneficiaryRequiredFieldsQueryInput
  ): Promise<BeneficiaryRequiredFields> {
    try {
      const query = `
        query beneficiaryRequiredFields(
          $bank_country: ISO3166_1!
          $currency: ISO4217!
          $beneficiary_country: ISO3166_1!
        ) {
          beneficiaryRequiredFields(
            bank_country: $bank_country
            currency: $currency
            beneficiary_country: $beneficiary_country
          ) {
            personal {
              variable
              regex
              variable_sub_type
              example
            }
            business {
              variable
              regex
              variable_sub_type
              example
              valid_bank_codes {
                code
                bank_name
                swift_bic
              }
            }
          }
        }
      `;

      const result = await this.executeGraphQL<{
        beneficiaryRequiredFields: BeneficiaryRequiredFields;
      }>(query, {
        bank_country: input.bank_country,
        currency: input.currency,
        beneficiary_country: input.beneficiary_country,
      });

      logger.info(
        `[RoutefusionService] Retrieved beneficiary required fields`
      );
      return result.beneficiaryRequiredFields;
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error getting beneficiary required fields: ${error}`
      );
      throw error;
    }
  }

  /**
   * Normalize regex pattern from API response
   * Handles regex with delimiters (/pattern/ or /pattern/flags) or without delimiters
   * Also handles escaped slashes within the pattern
   */
  private normalizeRegexPattern(regexString: string): string {
    if (!regexString) return regexString;

    let cleanRegex = regexString.trim();

    // Check if regex has delimiters (starts with /)
    if (cleanRegex.startsWith("/")) {
      // Find the last unescaped / (delimiter, not part of pattern)
      // Start from the end and work backwards to find the closing delimiter
      let lastSlashIndex = -1;
      for (let i = cleanRegex.length - 1; i > 0; i--) {
        if (cleanRegex[i] === "/") {
          // Check if it's escaped (odd number of backslashes before it)
          let backslashCount = 0;
          for (let j = i - 1; j >= 0 && cleanRegex[j] === "\\"; j--) {
            backslashCount++;
          }
          // If even number of backslashes (or zero), it's not escaped
          if (backslashCount % 2 === 0) {
            lastSlashIndex = i;
            break;
          }
        }
      }

      if (lastSlashIndex > 0) {
        // Extract pattern (between first / and last unescaped /)
        cleanRegex = cleanRegex.slice(1, lastSlashIndex);
        // Flags (if any) are after the last /, but we ignore them for validation
        // as we'll use the pattern with ^ and $ anchors
      } else {
        // No closing delimiter found, remove only the opening /
        cleanRegex = cleanRegex.slice(1);
      }
    }

    return cleanRegex;
  }

  async validateBusinessEntityDataToSubmit(
    input: any,
    country: ISO3166_1,
    entity_type: EntityType,
    business_type: BusinessType
  ): Promise<EntityValidationResult> {
    try {
      const requiredFields = await this.getEntityRequiredFields({
        country,
        entity_type,
        business_type,
      });
      const errors = [];

      for (const field of requiredFields.fields) {
        if (!input[field.variable]) {
          errors.push(`Field ${field.variable} is required`);
        }
        if (field.regex) {
          const cleanRegex = this.normalizeRegexPattern(field.regex);
          const regexPattern = `^${cleanRegex}$`;
          try {
            const valRegex = new RegExp(regexPattern).test(
              input[field.variable]
            );
            //logger.info(`[RoutefusionService] Validation regex: ${field.variable} - ${field.regex} - ${valRegex}`);
            if (!valRegex) {
              errors.push(`Field ${field.variable} it is not valid`);
            }
          } catch (regexError) {
            logger.error(
              `[RoutefusionService] Invalid regex pattern for ${field.variable}: ${field.regex} - ${regexError}`
            );
            errors.push(`Field ${field.variable} has invalid regex pattern`);
          }
        }
      }
      if (errors.length > 0) {
        return { success: false, errors };
      } else {
        return { success: true, errors: [] };
      }
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error validating data to submit: ${error}`
      );
      throw error;
    }
  }

  async validateRepresentativeDataToSubmit(
    input: any,
    country: ISO3166_1,
    entity_type: EntityType,
    business_type: BusinessType
  ): Promise<RepresentativeValidationResult> {
    try {
      const requiredFields = await this.getRepresentativeRequiredFields({
        country,
        entity_type,
        business_type,
      });
      const errors = [];

      for (const field of requiredFields.fields) {
        if (!input[field.variable]) {
          errors.push(`Field ${field.variable} is required`);
        }
        if (field.regex) {
          const cleanRegex = this.normalizeRegexPattern(field.regex);
          const regexPattern = `^${cleanRegex}$`;
          try {
            const valRegex = new RegExp(regexPattern).test(
              input[field.variable]
            );
            //logger.info(`[RoutefusionService] Validation regex: ${field.variable} - ${field.regex} - ${valRegex}`);
            if (!valRegex) {
              errors.push(`Field ${field.variable} it is not valid`);
            }
          } catch (regexError) {
            logger.error(
              `[RoutefusionService] Invalid regex pattern for ${field.variable}: ${field.regex} - ${regexError}`
            );
            errors.push(`Field ${field.variable} has invalid regex pattern`);
          }
        }
      }
      if (errors.length > 0) {
        return { success: false, errors };
      } else {
        return { success: true, errors: [] };
      }
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error validating data to submit: ${error}`
      );
      throw error;
    }
  }

  /**
   * Validate personal beneficiary data against required fields for the given corridor
   * Reference: https://docs.routefusion.com/reference/beneficiary-required-fields
   */
  async validatePersonalBeneficiaryDataToSubmit(
    input: any,
    bank_country: ISO3166_1,
    currency: string,
    beneficiary_country: ISO3166_1
  ): Promise<BeneficiaryValidationResult> {
    try {
      const requiredFields = await this.getBeneficiaryRequiredFields({
        bank_country,
        currency,
        beneficiary_country,
      });
      const errors = [];

      for (const field of requiredFields.personal) {
        if (!input[field.variable]) {
          errors.push(`Field ${field.variable} is required`);
        }
        if (field.regex && input[field.variable]) {
          const cleanRegex = this.normalizeRegexPattern(field.regex);
          const regexPattern = `^${cleanRegex}$`;
          try {
            const valRegex = new RegExp(regexPattern).test(
              input[field.variable]
            );
            if (!valRegex) {
              errors.push(`Field ${field.variable} is not valid`);
            }
          } catch (regexError) {
            logger.error(
              `[RoutefusionService] Invalid regex pattern for ${field.variable}: ${field.regex} - ${regexError}`
            );
            errors.push(`Field ${field.variable} has invalid regex pattern`);
          }
        }
      }
      if (errors.length > 0) {
        return { success: false, errors };
      } else {
        return { success: true, errors: [] };
      }
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error validating personal beneficiary data: ${error}`
      );
      throw error;
    }
  }

  /**
   * Validate business beneficiary data against required fields for the given corridor
   * Reference: https://docs.routefusion.com/reference/beneficiary-required-fields
   */
  async validateBusinessBeneficiaryDataToSubmit(
    input: any,
    bank_country: ISO3166_1,
    currency: string,
    beneficiary_country: ISO3166_1
  ): Promise<BeneficiaryValidationResult> {
    try {
      const requiredFields = await this.getBeneficiaryRequiredFields({
        bank_country,
        currency,
        beneficiary_country,
      });
      const errors = [];

      for (const field of requiredFields.business) {
        if (!input[field.variable]) {
          errors.push(`Field ${field.variable} is required`);
        }
        if (field.regex && input[field.variable]) {
          const cleanRegex = this.normalizeRegexPattern(field.regex);
          const regexPattern = `^${cleanRegex}$`;
          try {
            const valRegex = new RegExp(regexPattern).test(
              input[field.variable]
            );
            if (!valRegex) {
              errors.push(`Field ${field.variable} is not valid`);
            }
          } catch (regexError) {
            logger.error(
              `[RoutefusionService] Invalid regex pattern for ${field.variable}: ${field.regex} - ${regexError}`
            );
            errors.push(`Field ${field.variable} has invalid regex pattern`);
          }
        }
      }
      if (errors.length > 0) {
        return { success: false, errors };
      } else {
        return { success: true, errors: [] };
      }
    } catch (error) {
      logger.error(
        `[RoutefusionService] Error validating business beneficiary data: ${error}`
      );
      throw error;
    }
  }

  /**
   * Create a personal beneficiary
   * Reference: https://docs.routefusion.com/reference/create-personal-beneficiary
   */
  async createPersonalBeneficiary(
    input: CreatePersonalBeneficiaryInput
  ): Promise<string> {
    try {
      const mutation = `
        mutation createPersonalBeneficiary (
          $user_id: UUID!
          $entity_id: UUID!
          $email: Email!
          $phone: String
          $phone_country: ISO3166_1
          $first_name: String!
          $last_name: String!
          $address1: String
          $address2: String
          $city: String
          $state_province_region: String
          $postal_code: PostalCode
          $country: ISO3166_1!
          $tax_number: TaxNumber
          $name_on_bank_account: String
          $swift_bic: SwiftBic
          $account_type: AccountType
          $account_number: BankAccountNumber
          $routing_code: BankRoutingCode
          $currency: ISO4217!
          $bank_name: String
          $branch_name: String
          $bank_address1: String
          $bank_address2: String
          $bank_city: String
          $bank_state_province_region: String
          $bank_postal_code: PostalCode
          $bank_country: ISO3166_1!
          $tax_number_expiration: DateTime
          $date_of_birth: DateTime
        ) {
          createPersonalBeneficiary (
            user_id: $user_id
            entity_id: $entity_id
            email: $email
            phone: $phone
            phone_country: $phone_country
            first_name: $first_name
            last_name: $last_name
            address1: $address1
            address2: $address2
            city: $city
            state_province_region: $state_province_region
            postal_code: $postal_code
            country: $country
            tax_number: $tax_number
            name_on_bank_account: $name_on_bank_account
            swift_bic: $swift_bic
            account_type: $account_type
            account_number: $account_number
            routing_code: $routing_code
            currency: $currency
            bank_name: $bank_name
            branch_name: $branch_name
            bank_address1: $bank_address1
            bank_address2: $bank_address2
            bank_city: $bank_city
            bank_state_province_region: $bank_state_province_region
            bank_postal_code: $bank_postal_code
            bank_country: $bank_country
            tax_number_expiration: $tax_number_expiration
            date_of_birth: $date_of_birth
          )
        }
      `;

      const result = await this.executeGraphQL<{
        createPersonalBeneficiary: string;
      }>(mutation, input);

      console.log(
        `[RoutefusionService] Created personal beneficiary: ${result.createPersonalBeneficiary}`
      );
      return result.createPersonalBeneficiary;
    } catch (error) {
      console.log(
        `[RoutefusionService] Error creating personal beneficiary: ${error}`
      );
      throw error;
    }
  }

  /**
   * Create a business beneficiary
   * Reference: https://docs.routefusion.com/reference/create-business-beneficiary
   */
  async createBusinessBeneficiary(
    input: CreateBusinessBeneficiaryInput
  ): Promise<string> {
    try {
      const mutation = `
        mutation createBusinessBeneficiary (
          $user_id: UUID!
          $entity_id: UUID!
          $email: Email!
          $phone: String
          $phone_country: ISO3166_1
          $business_name: String!
          $business_address1: String
          $business_address2: String
          $business_city: String
          $business_state_province_region: String
          $business_postal_code: PostalCode
          $business_country: ISO3166_1!
          $tax_number: TaxNumber
          $name_on_bank_account: String
          $swift_bic: SwiftBic
          $account_type: AccountType
          $account_number: BankAccountNumber
          $routing_code: BankRoutingCode
          $currency: ISO4217!
          $bank_name: String
          $branch_name: String
          $bank_address1: String
          $bank_address2: String
          $bank_city: String
          $bank_state_province_region: String
          $bank_postal_code: PostalCode
          $bank_country: ISO3166_1!
        ) {
          createBusinessBeneficiary (
            user_id: $user_id
            entity_id: $entity_id
            email: $email
            phone: $phone
            phone_country: $phone_country
            business_name: $business_name
            business_address1: $business_address1
            business_address2: $business_address2
            business_city: $business_city
            business_state_province_region: $business_state_province_region
            business_postal_code: $business_postal_code
            business_country: $business_country
            tax_number: $tax_number
            name_on_bank_account: $name_on_bank_account
            swift_bic: $swift_bic
            account_type: $account_type
            account_number: $account_number
            routing_code: $routing_code
            currency: $currency
            bank_name: $bank_name
            branch_name: $branch_name
            bank_address1: $bank_address1
            bank_address2: $bank_address2
            bank_city: $bank_city
            bank_state_province_region: $bank_state_province_region
            bank_postal_code: $bank_postal_code
            bank_country: $bank_country
          )
        }
      `;

      const result = await this.executeGraphQL<{
        createBusinessBeneficiary: string;
      }>(mutation, input);

      console.log(
        `[RoutefusionService] Created business beneficiary: ${result.createBusinessBeneficiary}`
      );
      return result.createBusinessBeneficiary;
    } catch (error) {
      console.log(
        `[RoutefusionService] Error creating business beneficiary: ${error}`
      );
      throw error;
    }
  }
  /**
   * Create a transfer
   * This creates the transfer but does not initiate it. Use finalizeTransfer to initiate.
   * Reference: https://docs.routefusion.com/reference/create-transfer
   */
  async createTransfer(input: CreateTransferInput): Promise<string> {
    try {
      const mutation = `
        mutation createTransfer (
          $user_id: UUID!
          $entity_id: UUID!
          $source_amount: String
          $wallet_id: UUID
          $destination_amount: String
          $account_id: UUID
          $beneficiary_id: UUID!
          $purpose_of_payment: String!
          $reference: String
          $wire: Boolean
          $document_reference: String
        ) {
          createTransfer (
            user_id: $user_id
            entity_id: $entity_id
            source_amount: $source_amount
            wallet_id: $wallet_id
            destination_amount: $destination_amount
            account_id: $account_id
            beneficiary_id: $beneficiary_id
            purpose_of_payment: $purpose_of_payment
            reference: $reference
            wire: $wire
            document_reference: $document_reference
          )
        }
      `;

      const result = await this.executeGraphQL<{
        createTransfer: string;
      }>(mutation, input);

      console.log(
        `[RoutefusionService] Created transfer: ${result.createTransfer}`
      );
      return result.createTransfer;
    } catch (error) {
      console.log(`[RoutefusionService] Error creating transfer: ${error}`);
      throw error;
    }
  }

  /**
   * Finalize a transfer to initiate execution
   * Reference: https://docs.routefusion.com/reference/finalize-transfer
   */
  async finalizeTransfer(input: FinalizeTransferInput): Promise<boolean> {
    try {
      const mutation = `
        mutation finalizeTransfer (
          $transfer_id: UUID!
        ) {
          finalizeTransfer (
            transfer_id: $transfer_id
          )
        }
      `;

      const result = await this.executeGraphQL<{
        finalizeTransfer: boolean;
      }>(mutation, input);

      console.log(
        `[RoutefusionService] Finalized transfer: ${input.transfer_id} - ${result.finalizeTransfer}`
      );
      return result.finalizeTransfer;
    } catch (error) {
      console.log(`[RoutefusionService] Error finalizing transfer: ${error}`);
      throw error;
    }
  }

  /**
   * Get transfer by ID
   */
  async getTransfer(transferId: string): Promise<Transfer> {
    try {
      const query = `
        query getTransfer($transfer_id: UUID!) {
          transfer(transfer_id: $transfer_id) {
            id
            state
            source_amount
            destination_amount
            currency
            beneficiary_id
            created_at
            updated_at
          }
        }
      `;

      const result = await this.executeGraphQL<{
        transfer: Transfer;
      }>(query, { transfer_id: transferId });

      return result.transfer;
    } catch (error) {
      console.log(`[RoutefusionService] Error getting transfer: ${error}`);
      throw error;
    }
  }
}
