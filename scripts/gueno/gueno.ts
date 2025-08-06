import { 
  UserDataParams, 
  CreateConsumerResponse, 
  ConsumerEvent, 
  ConsumerEventResponse, 
  VerifyTransaction, 
  retrieveConsumerResponse, 
  retrieveTransactionResponse,
  TransactionEventResponse,
  TransactionEvent,
  GetConsumerList,
  GetConsumerListResponse
} from "./gueno.type";

const IS_SANDBOX: boolean = true; // TODO: Make this dynamic using the environment variable
const PRINT_CONSOLE_REQUEST: boolean = true;

const API_HOST = "https://api-gueno.prd.gueno.com/api";
const API_DASHBOARD = "https://www.dashboard.gueno.io";

const API_SANDBOX_HOST = "https://api-gueno.stg.gueno.com/api";
const API_SANDBOX_DASHBOARD = "https://www.sandbox.dashboard.gueno.io";



class GuenoService {
  static getApiHost(isSandbox: boolean = false): string {
    return isSandbox ? API_SANDBOX_HOST : API_HOST;
  }

  static getApiUrl(isSandbox: boolean = false): string {
    return `${this.getApiHost(isSandbox)}`;
  }

  static async guenoRequest(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: any
  ): Promise<any> {
    const headers=  {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": process.env.GUENO_API_KEY || "0b418ed1-4e03-4e98-ad30-4a62d6ed42d1",
    }
    
    // Print full request details
    if (PRINT_CONSOLE_REQUEST) {
      console.log('=== GUENO API REQUEST ===');
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('Headers:', JSON.stringify(headers, null, 2));
      if (data) {
      console.log('Body:', JSON.stringify(data, null, 2));
      }
      console.log('========================');
    }
    
    const response = await fetch(url, { method, headers, body: JSON.stringify(data) }).then(async (res) => {
      const responseData = await res.json();
      
      if (PRINT_CONSOLE_REQUEST) {
        console.log('=== GUENO API RESPONSE ===');
        console.log('Response:', JSON.stringify(responseData, null, 2));
        console.log('==========================');
      }
      
      if (res.status < 200 || res.status >= 300) {
        const formattedErrors: Record<string, string[]> = {};
        if (Array.isArray(responseData.message)) {
          const errorText = responseData.message.join(', ');
          throw new Error(`Failed with error: ${errorText}`);
        }
        throw new Error(JSON.stringify(formattedErrors));
      }
      return responseData;
    });
    
    // Print response details
    if (PRINT_CONSOLE_REQUEST) {
      console.log('=== GUENO API RESPONSE ===');
      console.log('Response:', JSON.stringify(response, null, 2));
      console.log('==========================');
    }
    
    return response;
  }

  /**
   * Create a new consumer user
   * @param data - The data to create the consumer user
   * @returns The response from the API
   */
  static async createConsumer(
    data: UserDataParams
  ): Promise<CreateConsumerResponse> {
    const response = await this.guenoRequest(
      `${this.getApiUrl(IS_SANDBOX)}/kyt/createConsumerUser`,
      "POST",
      data
    );

    return response;
  }

  /**
   * Retrieve a consumer user
   * @param userId - The ID of the consumer user to retrieve
   * @returns The response from the API
   */
  static async retrieveConsumer(
    userId: string
  ): Promise<retrieveConsumerResponse> {
    // Make API request
    const response = await this.guenoRequest(
      `${this.getApiUrl(IS_SANDBOX)}/kyt/retrieveConsumerUser/${userId}`,
      "GET"
    );

    return response;
  }

  /**
   * Update a consumer user using consumer Events
   * there is no direct update with out an event
   * @param userId - The ID of the consumer user to update
   * @param data - The data to update the consumer user
   * @returns The response from the API
   */
  static async updateConsumer(
    data: ConsumerEvent
  ): Promise<ConsumerEventResponse> {
    const response = await this.guenoRequest(
      `${this.getApiUrl(IS_SANDBOX)}/kyt/createConsumerUserEvent/`,
      "POST",
      data
    );

    return response;
  }

  /*
  * Verify a transaction
  * @param data - The data to verify the transaction
  * @returns The response from the API
  */
  static async verifyTransaction(
    data: VerifyTransaction
  ): Promise<ConsumerEventResponse> {
    const response = await this.guenoRequest(
      `${this.getApiUrl(IS_SANDBOX)}/kyt/verifyTransaction`,
      "POST",
      data
    );

    return response;
  }

  /**
   * Get a transaction
   * @param transactionId - The ID of the transaction to get
   * @returns The response from the API
   */
  static async getTransaction(
    transactionId: string
  ): Promise<retrieveTransactionResponse> {
    const response = await this.guenoRequest(
      `${this.getApiUrl(IS_SANDBOX)}/kyt/retrieveTransaction/${transactionId}`,
      "GET"
    );
    return response;
  }

  /**
   * Get a transaction
   * @param transactionId - The ID of the transaction to get
   * @returns The response from the API
   */
  static async updateTransaction(
    transactionId: string,
    data: TransactionEvent
  ): Promise<TransactionEventResponse> {
    const response = await this.guenoRequest(
      `${this.getApiUrl(IS_SANDBOX)}/kyt/updateTransaction/${transactionId}`,
      "POST",
      data
    );
    return response;
  }

  /*
  * Get consumer list
  * @param data - The data to get the consumer list
  * @returns The response from the API
  */
  static async getConsumerList(
    data: GetConsumerList
  ): Promise<GetConsumerListResponse> {
    // Build query parameters from the data object
    const queryParams = new URLSearchParams();
    
    if (data.viewMode !== undefined) {
      queryParams.append('viewMode', data.viewMode);
    }
    if (data.limit !== undefined) {
      queryParams.append('limit', data.limit.toString());
    }
    if (data.offset !== undefined) {
      queryParams.append('offset', data.offset.toString());
    }
    if (data.page !== undefined) {
      queryParams.append('page', data.page.toString());
    }
    
    const url = `${this.getApiUrl(IS_SANDBOX)}/kyt/consumerUsers/meru@gueno.com?${queryParams.toString()}`;
    
    const response = await this.guenoRequest(
      url,
      "GET"
    );
    return response;
  }
}

export default GuenoService;
