import "dotenv/config";
import { logger } from "../../shared/utils/logger";
import {
  CreateBusinessEntityInput,
  Entity,
  BusinessType,
} from "./types/entity.types";
import {
  CreateWalletInput,
  CreateVirtualAccountInput,
  GraphQLResponse,
  Wallet,
  VirtualAccount,
  BusinessEntity,
} from "./types/service.types";

export class RoutefusionService {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor() {
    this.apiKey = process.env.ROTEFUSION_API_KEY || process.env.ROUTEFUSION_API_KEY || "";
    
    if (!this.apiKey) {
      throw new Error("ROTEFUSION_API_KEY or ROUTEFUSION_API_KEY environment variable is required");
    }

    // Default to sandbox, can be overridden with env variable
    this.baseURL = process.env.ROUTEFUSION_API_URL || "https://sandbox.external.routefusion.com/graphql";
  }

  /**
   * Execute a GraphQL query or mutation
   */
  private async executeGraphQL<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    try {
      logger.info(`[RoutefusionService] Executing GraphQL request`);
      logger.debug(`[RoutefusionService] Query: ${query}`);
      if (variables) {
        logger.debug(`[RoutefusionService] Variables: ${JSON.stringify(variables, null, 2)}`);
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
        logger.error(`[RoutefusionService] HTTP error: ${response.status} ${response.statusText}`);
        throw new Error(`Routefusion API HTTP error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData: GraphQLResponse<T> = await response.json();

      if (responseData.errors && responseData.errors.length > 0) {
        const errorMessages = responseData.errors.map(e => e.message).join(", ");
        logger.error(`[RoutefusionService] GraphQL errors: ${errorMessages}`);
        throw new Error(`GraphQL errors: ${errorMessages}`);
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
   * Create a business entity
   * Returns the entity ID (UUID) from the mutation
   */
  async createBusinessEntity(input: CreateBusinessEntityInput): Promise<string> {
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
        $tax_number: TaxNumber
        $trade_name: TradeName
        $naics_code: NAICS
        $business_type: BusinessType
        $business_description: String
        $trading_symbol: String
        $owned_by: String
        $incorporation_date: DateTime
        $representatives: [RepresentativeInput]
        $accept_terms_and_conditions: Boolean!
        $average_monthly_transaction_count: String
        $average_monthly_volume: String
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
          tax_number: $tax_number
          trade_name: $trade_name
          naics_code: $naics_code
          business_type: $business_type
          business_description: $business_description
          trading_symbol: $trading_symbol
          owned_by: $owned_by
          incorporation_date: $incorporation_date
          representatives: $representatives
          accept_terms_and_conditions: $accept_terms_and_conditions
          average_monthly_transaction_count: $average_monthly_transaction_count
          average_monthly_volume: $average_monthly_volume
        )
      }
    `;

    const result = await this.executeGraphQL<{ createBusinessEntity: string }>(
      mutation,
      input
    );

    const entityId = result.createBusinessEntity;
    logger.info(`[RoutefusionService] Created business entity: ${entityId}`);
    return entityId;
  }

  /**
   * Create a business entity and return the full entity object
   */
  async createBusinessEntityAndFetch(input: CreateBusinessEntityInput): Promise<Entity> {
    const entityId = await this.createBusinessEntity(input);
    return await this.getEntity(entityId);
  }

  /**
   * Create a wallet for an entity
   */
  async createWallet(input: CreateWalletInput): Promise<Wallet> {
    const mutation = `
      mutation createWallet($input: CreateWalletInput!) {
        createWallet(input: $input) {
          id
          entity_id
          currency
          balance
        }
      }
    `;

    const result = await this.executeGraphQL<{ createWallet: Wallet }>(
      mutation,
      { input }
    );

    logger.info(`[RoutefusionService] Created wallet: ${result.createWallet.id} for currency: ${result.createWallet.currency}`);
    return result.createWallet;
  }

  /**
   * Create a virtual account (named virtual bank account) for a wallet
   */
  async createVirtualAccount(input: CreateVirtualAccountInput): Promise<VirtualAccount> {
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

    const result = await this.executeGraphQL<{ createVirtualAccount: VirtualAccount }>(
      mutation,
      { input }
    );

    logger.info(`[RoutefusionService] Created virtual account: ${result.createVirtualAccount.id} (${result.createVirtualAccount.name})`);
    if (result.createVirtualAccount.account_number) {
      logger.info(`[RoutefusionService] Account Number: ${result.createVirtualAccount.account_number}`);
      logger.info(`[RoutefusionService] Routing Number: ${result.createVirtualAccount.routing_number || "N/A"}`);
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

    const result = await this.executeGraphQL<{ virtualAccount: VirtualAccount }>(
      query,
      { id: virtualAccountId }
    );

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
      } 
    }>(
      query,
      { page, pageSize }
    );

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

    const result = await this.executeGraphQL<{ wallet: Wallet }>(
      query,
      { id: walletId }
    );

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

    const result = await this.executeGraphQL<{ entity: Entity }>(
      query,
      { entity_id: entityId }
    );

    return result.entity;
  }
}