import axios, { AxiosInstance } from "axios";
import "dotenv/config";

export class IntercomService {
    private readonly apiClient: AxiosInstance;
  
    constructor() {
      this.apiClient = axios.create({
        baseURL: "https://api.intercom.io",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "Intercom-Version": "2.13",
          authorization: `Bearer ${process.env.INTERCOM_API_KEY}`,
        },
      });
    }
    // ADMIN LABEL
    // si conversation State close, y admin label es resolve entonces no hago nada
    // si conversation State close, y admin label no es resolve entonces entonces cambio a admin label a resolve
  
    async searchConversations(cursor?: string) {
      const body = {
        query: {
          operator: "AND",
          value: [
            {
              field: "state",
              operator: "=",
              value: "closed",
            },
          ],
        },
        pagination: {
          per_page: 1,
          ...(cursor && { starting_after: cursor }),
        },
      };
  
      const response = await this.apiClient.post("/conversations/search", body);
      return response.data;
    }

    async getTickets(cursor?: string){
        const body = {
            query: {
              operator: "AND",
              value: [
                {
                  field: "open",
                  operator: "=",
                  value: "false",
                },
                {
                    field: "state",
                    operator: "!=",
                    value: "resolved",
                }
              ],
            },
            pagination: {
              per_page: 15,
              ...(cursor && { starting_after: cursor }),
            },
            sort_by: {
                field: "created_at",
                order: "desc"
              }
          };
      
          const response = await this.apiClient.post("/tickets/search", body);
          return response.data;
    }

    async updateTicket(ticketId: string){
        const body = {
            ticket_state_id: "4",
        }
        const response = await this.apiClient.put(`/tickets/${ticketId}`, body);
        return response.data;
    }
  }