import axios, { AxiosInstance } from "axios";
import "dotenv/config";

interface Wallet {
  blockchain: string;
  address: string;
}

interface Address {
  address1: string;
  postalCode: string;
  city: string;
  country: string;
}

interface CreateUserPayload {
  wallet: Wallet;
  address: Address;
  lastName: string;
  firstName: string;
  email: string;
  dateOfBirth: string;
  countryOfResidence: string;
  countryOfBirth: string;
}

export class KulipaService {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: "https://api.testing.kulipa.dev/v1",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": process.env.KULIPA_API_KEY,
      },
    });
  }

  async createUser(userData: CreateUserPayload) {
    try {
      const response = await this.apiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "Failed to create user:",
          error.response?.data?.details?.issues
        );
      }
      throw error;
    }
  }
}
