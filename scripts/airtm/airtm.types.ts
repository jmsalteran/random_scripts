export type TransactionStatus =
  | "PENDING_FUNDING"
  | "PROCESSING_WITHDRAW"
  | "COMPLETED"
  | "CANCELED"
  | "REFUNDED";

export type DocumentType = "PASSPORT" | "NATIONAL_ID" | "DRIVER_LICENSE";
export type RiskRating = "LOW" | "MEDIUM" | "HIGH";
export type KycStatus = "VERIFIED" | "PARTIALLY_VERIFIED" | "NOT_VERIFIED";
export type KycLevel = "BASIC" | "FULL";
export type ProviderResult = "GREEN" | "AMBER" | "RED";
export type FundingRailId = "stellar.usdc";
export type ExecutionChannel = "DIRECT_OFFRAMP" | "P2P_NETWORK";
export type SortOrder = "asc" | "desc";

export interface KycProvider {
  name: string;
  applicantId: string;
  result: ProviderResult;
}

export interface KycReliance {
  performedBy: string;
  kycReferenceId: string;
  status: KycStatus;
  performedAt: string;
  level: KycLevel;
  documentType: DocumentType;
  provider: KycProvider;
}

export interface Screening {
  sanctionsHit: boolean;
  pepHit: boolean;
  adverseMediaHit: boolean;
  riskRating: RiskRating;
  screenedAt: string;
}

export interface SessionContext {
  ipAddress: string;
  userAgent: string;
  deviceId: string;
}

export interface SenderAddress {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface SenderContact {
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
}

export interface SenderIndividual {
  firstName: string;
  lastName: string;
  dob: string;
  nationalIdNumber: string;
  nationality: string;
}

export interface CreateSenderRequest {
  externalSenderId: string;
  partyType: "individual" | "business";
  countryOfResidence: string;
  enabledFundingRailIds?: FundingRailId[];
  individual: SenderIndividual;
  contact: SenderContact;
  address: SenderAddress;
  compliance: {
    kycReliance: KycReliance;
    screening: Screening;
    sessionContext: SessionContext;
  };
}

export interface UpdateSenderRequest {
  partyType?: "individual" | "business";
  countryOfResidence?: string;
  enabledFundingRailIds?: string[];
  individual?: Partial<SenderIndividual>;
  contact?: { phoneNumber?: string; phoneCountryCode?: string };
  address?: Partial<SenderAddress>;
  compliance?: {
    kycReliance?: KycReliance;
    screening?: Screening;
    sessionContext?: SessionContext;
  };
}

export interface SenderApiResponse {
  id: string;
  externalSenderId: string;
  partyType: "individual" | "business";
  countryOfResidence: string;
  individual: SenderIndividual;
  contact: { phoneCountryCode: string; phoneNumber: string; email: string };
  address: SenderAddress;
  compliance: {
    sessionContext: SessionContext;
    screening: Screening & { screenedAt: string };
    kycReliance: KycReliance;
  };
  fundingRailInstances: Array<{
    data: Record<string, unknown>;
    type: "CRYPTO" | "FIAT";
    railId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiverIndividual {
  firstName: string;
  lastName: string;
  dob: string;
  nationalIdNumber: string;
}

export interface ReceiverContact {
  email: string;
  phone: string;
}

export interface CreateReceiverPayoutDestination {
  paymentRailId: string;
  destination: Record<string, unknown>;
  senderId: string;
}

export interface CreateReceiverRequest {
  externalReceiverId: string;
  partyType: "individual" | "business";
  country: string;
  payoutDestinations?: CreateReceiverPayoutDestination[];
  individual: ReceiverIndividual;
  contact: ReceiverContact;
  address: SenderAddress;
  compliance: { kycReliance: KycReliance };
}

export interface UpdateReceiverRequest {
  partyType?: "individual" | "business";
  country?: string;
  individual?: Partial<ReceiverIndividual>;
  contact?: Partial<ReceiverContact>;
  address?: Partial<SenderAddress>;
  compliance?: { kycReliance?: KycReliance };
}

export interface ReceiverApiResponse {
  id: string;
  externalReceiverId: string;
  partyType: "individual" | "business";
  country: string;
  individual: ReceiverIndividual;
  contact: { phone: string; email: string };
  address: SenderAddress;
  compliance: { kycReliance: KycReliance };
  payoutDestinations: Array<{
    destination: Record<string, unknown>;
    paymentRailId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AddPaymentRailInstanceRequest {
  paymentRailId: string;
  destination: Record<string, unknown>;
  senderId: string;
}

export interface PaymentRailInstanceApiResponse {
  id: string;
  paymentRailId: string;
  destination: Record<string, unknown>;
  senderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteRequest {
  senderId: string;
  receiverId: string;
  fundingRailId: FundingRailId;
  paymentRailId: string;
  amountToSend?: number;
  amountToReceive?: number;
}

export interface QuoteFees {
  airtmFeeAmount: number;
  airtmFeePercentage: number;
}

export interface QuoteAmounts {
  amount: number;
  currency: string;
}

export interface QuoteApiResponse {
  id: string;
  senderId: string;
  receiverId: string;
  fundingRailId: string;
  paymentRailId: string;
  request: { amountToReceive?: number; amountToSend?: number };
  result: {
    p2p: {
      baseExchangeRate?: number;
      netExchangeRate: number;
      fees: QuoteFees;
      amountToSend: QuoteAmounts;
      amountToReceive: QuoteAmounts;
    };
  };
  expiresAt: string;
  createdAt: string;
}

export interface CreateTransactionRequest {
  quoteId: string;
  executionChannel: ExecutionChannel;
}

export interface TransactionApiResponse {
  id: string;
  status: TransactionStatus;
  stellarTransactionId?: string;
  refundStellarTransactionId?: string;
  quote: {
    id: string;
    senderId: string;
    receiverId: string;
    fundingRailId: string;
    paymentRailId: string;
    result: {
      p2p: {
        baseExchangeRate?: number;
        netExchangeRate: number;
        fees: QuoteFees;
        amountToSend: QuoteAmounts;
        amountToReceive: QuoteAmounts;
      };
    };
    expiresAt: string;
    createdAt: string;
  };
  depositInstructions: {
    type: "CRYPTO" | "FIAT";
    chain?: string;
    asset?: string;
    address?: string;
    memo?: string;
    amount: { value: number; currency: string };
  };
  createdAt: string;
}

export interface ListTransactionsParams {
  before?: string;
  after?: string;
  perPage?: number;
  senderId?: string;
  order?: SortOrder;
}

export interface Paginated<T> {
  items: T[];
  startCursor?: string;
  endCursor?: string;
}

export interface DestinationFieldDescriptor {
  required: boolean;
  pattern?: string;
  title?: string;
  options?: string[];
  type?: string;
}

export interface CatalogRailItem {
  id: string;
  currency: string;
  country: string;
  destinationType: string;
  destinationFields: Record<string, DestinationFieldDescriptor>;
}

export interface ListCatalogParams {
  before?: string;
  after?: string;
  perPage?: number;
  country?: string;
  currency?: string;
}
