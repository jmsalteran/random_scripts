import {
  AddPaymentRailInstanceRequest,
  CatalogRailItem,
  CreateQuoteRequest,
  CreateReceiverRequest,
  CreateSenderRequest,
  CreateTransactionRequest,
  ListCatalogParams,
  ListTransactionsParams,
  Paginated,
  PaymentRailInstanceApiResponse,
  QuoteApiResponse,
  ReceiverApiResponse,
  SenderApiResponse,
  TransactionApiResponse,
  UpdateReceiverRequest,
  UpdateSenderRequest,
} from "./airtm.types";

export class AirtmService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.AIRTM_API_KEY ?? "";
    this.baseUrl =
      process.env.AIRTM_URL ?? "https://api.stg.enterprise.airtm.com/v2";

    if (!this.apiKey) {
      throw new Error("AIRTM_API_KEY environment variable is required");
    }
  }

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Api-Key ${this.apiKey}`,
    };
  }

  private async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      query?: Record<string, string | number | undefined>;
      extraHeaders?: Record<string, string>;
    } = {}
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (options.query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) params.set(k, String(v));
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const res = await fetch(url, {
      method,
      headers: { ...this.headers, ...(options.extraHeaders ?? {}) },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw new Error(
        `[Airtm] HTTP ${res.status} ${method} ${path}: ${JSON.stringify(data)}`
      );
    }

    return data as T;
  }

  // ─── Senders ─────────────────────────────────────────────────────────────

  async createSender(body: CreateSenderRequest): Promise<SenderApiResponse> {
    return this.request<SenderApiResponse>("POST", "/embedded/senders", { body });
  }

  async getSenderByExternalId(externalSenderId: string): Promise<SenderApiResponse> {
    return this.request<SenderApiResponse>("GET", "/embedded/senders", {
      query: { externalSenderId },
    });
  }

  async getSenderById(senderId: string): Promise<SenderApiResponse> {
    return this.request<SenderApiResponse>("GET", `/embedded/senders/${senderId}`);
  }

  async updateSender(
    senderId: string,
    body: UpdateSenderRequest
  ): Promise<SenderApiResponse> {
    return this.request<SenderApiResponse>("PUT", `/embedded/senders/${senderId}`, {
      body,
    });
  }

  // ─── Receivers ───────────────────────────────────────────────────────────

  async createReceiver(body: CreateReceiverRequest): Promise<ReceiverApiResponse> {
    return this.request<ReceiverApiResponse>("POST", "/embedded/receivers", { body });
  }

  async getReceiverByExternalId(
    externalReceiverId: string
  ): Promise<ReceiverApiResponse> {
    return this.request<ReceiverApiResponse>("GET", "/embedded/receivers", {
      query: { externalReceiverId },
    });
  }

  async getReceiverById(receiverId: string): Promise<ReceiverApiResponse> {
    return this.request<ReceiverApiResponse>(
      "GET",
      `/embedded/receivers/${receiverId}`
    );
  }

  async updateReceiver(
    receiverId: string,
    body: UpdateReceiverRequest
  ): Promise<ReceiverApiResponse> {
    return this.request<ReceiverApiResponse>(
      "PUT",
      `/embedded/receivers/${receiverId}`,
      { body }
    );
  }

  async addPaymentRailInstance(
    receiverId: string,
    body: AddPaymentRailInstanceRequest
  ): Promise<PaymentRailInstanceApiResponse> {
    return this.request<PaymentRailInstanceApiResponse>(
      "POST",
      `/embedded/receivers/${receiverId}/payment-rail-instance`,
      { body }
    );
  }

  async removePaymentRailInstance(
    receiverId: string,
    paymentRailInstanceId: string
  ): Promise<void> {
    return this.request<void>(
      "DELETE",
      `/embedded/receivers/${receiverId}/payment-rail-instance/${paymentRailInstanceId}`
    );
  }

  // ─── Quotes ──────────────────────────────────────────────────────────────

  async createQuote(body: CreateQuoteRequest): Promise<QuoteApiResponse> {
    return this.request<QuoteApiResponse>("POST", "/embedded/quotes", { body });
  }

  // ─── Transactions ─────────────────────────────────────────────────────────

  async listTransactions(
    params?: ListTransactionsParams
  ): Promise<Paginated<TransactionApiResponse>> {
    return this.request<Paginated<TransactionApiResponse>>(
      "GET",
      "/embedded/transactions",
      { query: params as Record<string, string | number | undefined> }
    );
  }

  async createTransaction(
    body: CreateTransactionRequest,
    idempotencyKey: string
  ): Promise<TransactionApiResponse> {
    return this.request<TransactionApiResponse>("POST", "/embedded/transactions", {
      body,
      extraHeaders: { "idempotency-key": idempotencyKey },
    });
  }

  async getTransactionById(id: string): Promise<TransactionApiResponse> {
    return this.request<TransactionApiResponse>(
      "GET",
      `/embedded/transactions/${id}`
    );
  }

  // ─── Catalog ─────────────────────────────────────────────────────────────

  async listCatalog(
    params?: ListCatalogParams
  ): Promise<Paginated<CatalogRailItem>> {
    return this.request<Paginated<CatalogRailItem>>("GET", "/embedded/catalog", {
      query: params as Record<string, string | number | undefined>,
    });
  }

  // ─── Webhooks ────────────────────────────────────────────────────────────

  async getWebhookPortalUrl(): Promise<{ url: string }> {
    return this.request<{ url: string }>("GET", "/embedded/webhooks/portal-url");
  }
}

export default AirtmService;
