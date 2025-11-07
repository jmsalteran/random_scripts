import "dotenv/config";
import { logger } from "../../shared/utils/logger";
import {
  CreateBusinessEntityInput,
  Entity,
  BusinessType,
  CreateUserInput,
  RoutefusionBusiness,
  RoutefusionUser,
} from "./types/entity.types";
import {
  CreateWalletInput,
  CreateVirtualAccountInput,
  GraphQLResponse,
  Wallet,
  VirtualAccount,
  BusinessEntity,
  RoutefusionGraphQLError,
  UploadBusinessEntityDocumentInput,
  UploadDocumentResponse,
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
      if (variables) {
        logger.debug(
          `[RoutefusionService] Variables: ${JSON.stringify(
            variables,
            null,
            2
          )}`
        );
      }

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
   * Upload an entity document
   */
  async uploadEntityDocument(
    input: UploadBusinessEntityDocumentInput
  ): Promise<UploadDocumentResponse> {
    try {
      const mutation = `
        mutation singleUpload(
          $file: Upload!
        ) {
          singleUpload(
            file: $file
            entity_id: "${input.entityId}"
            file_enum: ${input.file_enum}
          ) {
            filename
          }
        }
      `;
      const result = await this.executeGraphQL<{
        singleUpload: UploadDocumentResponse;
      }>(mutation, { file: input.file });
      logger.info(
        `[RoutefusionService] Uploaded document: ${JSON.stringify(result, null, 2)}`
      );
      return result.singleUpload;
    } catch (error) {
      logger.error(`[RoutefusionService] Error uploading document: ${error}`);
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
}
