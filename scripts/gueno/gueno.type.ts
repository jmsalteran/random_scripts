// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

/**
 * User personal details for registration and profile management
 */
export interface UserDetails {
  name: UserName; // User name, required
  dateOfBirth?: string; // Date of birth (YYYY-MM-DD), required, match pattern: ^(\d{4}-\d{2}-\d{2})*$
  countryOfResidence?: string; // Country of residence, required, >= 1 characters
  countryOfNationality?: string; // Country of nationality, required, >= 1 characters
  gender?: "M" | "F" | "NB"; // Optional gender, allowed values: M, F, NB
}

/**
 * User name structure with optional middle name
 */
export interface UserName {
  firstName: string; // First name, required
  middleName?: string; // Optional middle name
  lastName: string; // Last name, required
}

/**
 * User account state management
 */
export interface UserStateDetails {
  userId?: string; // Unique user ID, required, >= 1 characters
  reason?: string; // Optional reason
  state:
    | "UNACCEPTABLE"
    | "TERMINATED"
    | "ACTIVE"
    | "DORMANT"
    | "CREATED"
    | "SUSPENDED"
    | "BLOCKED"; // State, required, allowed values: UNACCEPTABLE, TERMINATED, ACTIVE, DORMANT, CREATED, SUSPENDED, BLOCKED
}

/**
 * KYC (Know Your Customer) verification status
 */
export interface KycStatusDetails {
  reason?: string; // Optional reason
  status:
    | "SUCCESSFUL"
    | "FAILED"
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "MANUAL_REVIEW"; // Status, allowed values: SUCCESSFUL, FAILED, NOT_STARTED, IN_PROGRESS, MANUAL_REVIEW
}

/**
 * Legal identity document information
 */
export interface LegalDocument {
  documentType: string; // Document type, required, >= 1 characters
  documentNumber: string; // Document number, required, >= 1 characters
  documentIssuedDate?: number; // Optional issuance date (UNIX timestamp in milliseconds)
  documentExpirationDate?: number; // Optional expiration date (UNIX timestamp in milliseconds)
  documentIssuedCountry: string; // Issuance country, required, Alpha-2-code as described in ISO 3166
  nameOnDocument?: UserName; // Name on document, required
}

/**
 * PEP (Politically Exposed Person) status information
 */
export interface PEPstatus {
  isPepHit: boolean; // Flag indicating if the user is a PEP hit
  pepCountry: string; // PEP country, required, >= 2 characters, <= 2 characters
}

// ============================================================================
// CONTACT & ADDRESS TYPES
// ============================================================================

/**
 * Generic tag structure for key-value pairs
 */
export interface Tag {
  key: string; // Key, required, >= 1 characters
  value: string; // Value, required, >= 1 characters
}

/**
 * User contact information
 */
export interface ContactDetails {
  emailIds?: string[]; // Optional array of email addresses
  contactNumbers?: string[]; // Optional array of contact numbers
  faxNumbers?: string[]; // Optional array of fax numbers
  websites?: string[]; // Optional array of websites
  addresses?: Address[]; // Optional array of addresses
}

/**
 * Physical address structure
 */
export interface Address {
  addressLines: string[]; // Optional array of address lines
  postcode: string; // Optional postcode
  city: string; // Optional city
  state?: string; // Optional state
  country: string; // Optional country
  tags?: Tag[]; // Optional array of tags
}

// ============================================================================
// LIMITS & RESTRICTIONS TYPES
// ============================================================================

/**
 * Transaction limits for different time periods
 */
export interface TransactionLimits {
  maximumDailyTransactionLimit?: AmountLimit; // Optional daily transaction limit
  maximumWeeklyTransactionLimit?: AmountLimit; // Optional weekly transaction limit
  maximumMonthlyTransactionLimit?: AmountLimit; // Optional monthly transaction limit
  maximumQuarterlyTransactionLimit?: AmountLimit; // Optional quarterly transaction limit
  maximumYearlyTransactionLimit?: AmountLimit; // Optional yearly transaction limit
}

/**
 * Amount with currency specification
 */
export interface AmountLimit {
  amountValue: number; // Amount value
  amountCurrency: string; // Amount currency
}

/**
 * Payment method specific limits (to be defined as needed)
 */
export interface PaymentMethodLimits {
  // Define as needed
}

/**
 * Saved payment method details (to be defined as needed)
 */
export interface SavedPaymentDetails {
  // Define as needed
}

// ============================================================================
// MAIN USER DATA PARAMETERS
// ============================================================================

/**
 * Complete user data structure for consumer management
 */
export interface UserDataParams {
  userId: string; // Unique user ID, required, >= 1 characters
  userDetails: UserDetails; // Model for transaction user personal details, required
  createdTimestamp: number; // Timestamp when userId is created, required, >= 1262300400000
  userStateDetails?: UserStateDetails; // Optional user state details
  kycStatusDetails?: KycStatusDetails; // Optional KYC status details
  legalDocuments?: LegalDocument[]; // Optional array of legal identity documents
  tags?: Tag[]; // Optional array of tags
  contactDetails?: ContactDetails; // Optional contact details
  transactionLimits?: TransactionLimits; // Optional transaction limits
  paymentMethodLimits?: PaymentMethodLimits; // Optional payment method limits
  riskLevel?: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | "VERY_LOW"; // Optional risk level, allowed values: VERY_HIGH, HIGH, MEDIUM, LOW, VERY_LOW
  acquisitionChannel?:
    | "ORGANIC"
    | "PAID"
    | "REFERRAL"
    | "OFFLINE"
    | "GATHERING"
    | "UNKNOWN"; // Optional acquisition channel, allowed values: ORGANIC, PAID, REFERRAL, OFFLINE, GATHERING, UNKNOWN
  savedPaymentDetails?: SavedPaymentDetails[]; // Optional array of saved payment details
  reasonForAccountOpening?: string[]; // Optional reasons for account opening
  userSegment?: "RETAIL" | "PROFESSIONAL"; // Optional user segment, allowed values: RETAIL, PROFESSIONAL
  pepStatus?: PEPstatus[]; // Optional PEP status
}

// ============================================================================
// CARD PAYMENT TYPES
// ============================================================================

/**
 * Supported card brands for payment processing
 */
export type CardBrand = 
  | "VISA"
  | "MASTERCARD"
  | "AMERICAN_EXPRESS"
  | "DISCOVER"
  | "UNIONPAY"
  | "RUPAY"
  | "JCB"
  | "ALELO"
  | "CABAL"
  | "DINERS_CLUB"
  | "ELO"
  | "GOOD_CARD"
  | "HIPERCARD"
  | "POLICARD"
  | "SENFF"
  | "TICKET"
  | "UP_BRASIL"
  | "VALECARD"
  | "BANRICOMPRAS"
  | "SODEXO"
  | "VERDECARD";

/**
 * Card funding types
 */
export type CardFunding = "CREDIT" | "DEBIT" | "PREPAID";

/**
 * Card physical type
 */
export type CardType = "VIRTUAL" | "PHYSICAL";

/**
 * Card expiration date
 */
export interface CardExpiry {
  month?: string;
  year?: string;
}

/**
 * Name as it appears on the card
 */
export interface NameOnCard {
  firstName: string;
  middleName?: string;
  lastName?: string;
}

/**
 * Merchant information for transactions
 */
export interface MerchantDetails {
  id?: string;
  category?: string;
  MCC?: string; // Merchant Category Code
  city?: string;
  country?: string;
  state?: string;
  postCode?: string;
}

/**
 * Card payment details
 */
export interface CardPaymentDetails extends BasePaymentDetails {
  method: "CARD"; // Classify the method of payment as "Card" for CardDetails. Allowed value: CARD
  cardFingerprint?: string; // Unique card fingerprint that helps identify a specific card without having to use explicit card number. This is likely available at your card payment scheme provider (>= 1 characters)
  cardIssuedCountry?: string; // The country of issuance for a specific card (>= 1 characters)
  transactionReferenceField?: string; // Reference for the transaction (>= 1 characters)
  "3dsDone"?: boolean; // Whether 3ds was successfully enforced for the transaction
  nameOnCard?: NameOnCard; // Model for a generic consumer name
  cardExpiry?: CardExpiry; // Card expiry
  cardLast4Digits?: string; // Last 4 digits of Card.
  cardBrand?: CardBrand; // Brand of Card.
  cardFunding?: CardFunding; // Funding of Card. Allowed values: CREDIT, DEBIT, PREPAID
  cardAuthenticated?: boolean; // Authentication of Card.
  paymentChannel?: string; // Payment channel.
  cardType?: CardType; // Card type. Allowed values: VIRTUAL, PHYSICAL
  merchantDetails?: MerchantDetails;
}

/**
 * Base payment method details
 */
export interface BasePaymentDetails {
  method: string;
}

/**
 * Bank address
 */
export interface BankAddress {
  addressLines: string[];
  postcode: string;
  city: string;
  state?: string;
  country: string;
  tags?: Tag[];
}

/**
 * Bank account payment details
 */
export interface BankAccountPaymentDetails extends BasePaymentDetails {
  method: "GENERIC_BANK_ACCOUNT"; // Classify the method of payment as "GENERIC_BANK_ACCOUNT" for GenericBankAccountDetails. Allowed value: GENERIC_BANK_ACCOUNT
  accountNumber?: string; // Bank account number (>= 1 characters)
  accountType?: "CHECKING" | "SAVINGS"; // Bank account type. E.g. Checking, Savings etc.
  bankName?: string; // Name of the bank (>= 1 characters)
  bankCode?: string; // Unique identifier of the bank. In some countries, this can be the same as the bank's SWIFT code
  name?: string; // Name of the account holder
  bankAddress?: BankAddress; // Model for standardized address
  specialInstructions?: string; // Special instructions to be specified if any
  paymentChannel?: string; // Payment channel
}

/**
 * IBAN payment details
 */
export interface IBANPaymentDetails extends BasePaymentDetails {
  method: "IBAN"; // Classify the method of payment as "IBAN" for IBANDetails. Allowed value: IBAN
  BIC?: string; // Identifier for the bank. Can be routing number, BIK number, SWIFT code, BIC number etc. (>= 1 characters)
  bankName?: string; // Name of the bank (>= 1 characters)
  bankAddress?: BankAddress; // Model for standardized address. 
  country?: string; // Country
  IBAN?: string; // Account number of the user. Can be account number, IBAN number etc.
  name?: string; // Name of the bank account holder
  tags?: Tag[]; // Additional information that can be added via tags
  bankBranchCode?: string; // Branch code of the bank. In some countries, this can be the same as the bank's SWIFT code
  paymentChannel?: string; // Payment channel
}

/**
 * ACH payment details
 */
export interface ACHPaymentDetails extends BasePaymentDetails {
  method: "ACH"; // Classify the method of payment as "ACH" for ACHDetails. Allowed value: ACH
  routingNumber?: string; // Routing number of the bank (>= 1 characters)
  accountNumber?: string; // Bank account number of the individual (>= 1 characters)
  bankName?: string; // Name of the bank (>= 1 characters)
  name?: string; // Name of the account holder
  bankAddress?: BankAddress; // Model for standardized address. 
  beneficiaryName?: string; // Beneficiary name of the account
}

/**
 * SWIFT payment details
 */
export interface SWIFTPaymentDetails extends BasePaymentDetails {
  method: "SWIFT"; // Classify the method of payment as "SWIFT" for SWIFTDetails. Allowed value: SWIFT
  swiftCode?: string; // SWIFT code of the financial institution (>= 1 characters)
  bankCode: string; // Unique identifier of the bank. In some countries, this can be the same as the bank's SWIFT code
  accountNumber?: string; // Account number (>= 1 characters)
  accountType?: "CHECKING" | "SAVINGS"; // Account type. E.g. Checking, Savings etc.
  bankName?: string; // Name of the bank (>= 1 characters)
  name?: string; // Name of the account holder
  bankAddress?: BankAddress; // Model for standardized address.
  specialInstructions?: string; // Special instructions if any
}

/**
 * UPI payment details
 */
export interface UPIPaymentDetails extends BasePaymentDetails {
  method: "UPI"; // Classify the method of payment as "UPI" for UPIDetails. Allowed value: UPI
  upiId: string; // UPI Id number (>= 1 characters)
  bankProvider?: string; // Bank provider name (>= 1 characters)
  interfaceProvider?: string; // Interface provider name (>= 1 characters)
  name?: string; // Name of the account holder
}

/**
 * Mobile money payment details
 */
export interface MpesaPaymentDetails extends BasePaymentDetails {
  method: "MPESA"; // Classify the method of payment as "Mpesa" for MpesaDetails. Allowed value: MPESA
  businessShortCode: string; // Business code. (>= 1 characters)
  transactionType: 
    | "CustomerPayBillOnline" 
    | "CustomerBuyGoodsOnline"
    | "SalaryPayment"
    | "BusinessPayment"
    | "PromotionPayment"; // Allowed values: CustomerPayBillOnline, CustomerBuyGoodsOnline, SalaryPayment, BusinessPayment, PromotionPayment
  phoneNumber: string; // Contact Number of the account holder.
}

/**
 * Digital wallet payment details
 */
export interface WalletPaymentDetails extends BasePaymentDetails {
  method: "WALLET"; // Classify the method of payment as "Wallet" for WalletDetails. Allowed value: WALLET
  walletType: string; // Wallet type if there are various types of wallets belonging to the same user. E.g. Checking, savings, vault, different currency wallets etc.
  walletId?: string; // Unique ID of the wallet (>= 1 characters)
  paymentChannel?: string; // Payment Channel used through wallet
  name?: string; // Name of the account holder for a specific wallet
  tags?: Tag[]; // Additional information that can be added via tags
  walletPhoneNumber?: string; // Phone number associated with the wallet, if any
}

/**
 * QR code payment details
 */
export interface QRCodePaymentDetails extends BasePaymentDetails {
  method: "QR_CODE";
  qrCode: string; // A unique identifier for the QR code.
  merchantId?: string; // The identification number of the merchant, optional.
  qrData: string; // The URL or data encoded in the QR code.
  transactionType: string; // The type of transaction being processed (e.g., purchase).
}

/**
 * TED payment details (Brazil)
 */
export interface TEDPaymentDetails extends BasePaymentDetails {
  method: "TED";
  senderBank: string; // The name of the bank that is sending the transfer.
  recipientBank?: string; // The name of the bank receiving the transfer, optional.
  accountNumber: string; // The bank account number where the transfer will be deposited.
  agencyNumber?: string; // The number of the bank branch, optional.
}

/**
 * Boleto payment details (Brazil)
 */
export interface BoletoPaymentDetails extends BasePaymentDetails {
  method: "BOLETO";
  boletoNumber: string; // The number of the "boleto" (bank slip).
  dueDate?: string; // The due date of the "boleto" (bank slip), optional.
  payeeCode?: string; // The code of the payee, optional.
}

/**
 * PIX payment details (Brazil)
 */
export interface PIXPaymentDetails extends BasePaymentDetails {
  method: "PIX";
  keyType: string; // The type of key used to identify the destination account in the PIX system.
  keyValue: string; // The value of the key corresponding to the selected key type.
}

/**
 * CBU payment details (Argentina)
 */
export interface CBUPaymentDetails extends BasePaymentDetails {
  method: "CBU"; // The type of payment method. Allowed value: CBU. Default: CBU
  CBU: string; // The unique key that identifies bank accounts for transactions in Argentina.
  typeAccount?: string; // Specifies the type of currency account (e.g., USD), optional.
  numberAccount?: string; // The specific account number, optional.
  bankName?: string; // The name of the bank where the account is held.
  holderName?: string; // The name of the account holder.
  holderId?: string; // The identification number of the account holder (like a tax ID, CUIL or CUIT).
}

/**
 * CVU payment details (Argentina)
 */
export interface CVUPaymentDetails extends BasePaymentDetails {
  method: "CVU"; // The type of payment method. Allowed value: CVU. Default: CVU
  CVU: string; // A unique key for virtual wallet services, analogous to the CBU for bank accounts.
  virtualWallet?: string; // The name of the virtual wallet platform (e.g., Mercado Pago).
  holderName?: string; // The name of the virtual wallet account holder.
  holderId?: string; // The identification number of the virtual wallet account holder.
}

/**
 * DEBIN payment details (Argentina)
 */
export interface DEBINPaymentDetails extends BasePaymentDetails {
  method: "DEBIN";
  authorizationCode: string; // A unique code provided for the transaction.
  issuerBank: string; // The bank that is issuing the DEBIN request.
  recipientBank: string; // The bank receiving the DEBIN request.
  expirationDate: string; // The date when the DEBIN request expires.
  transactionId?: string; // A unique identifier for the transaction, optional.
}

/**
 * Check payment details
 */
export interface CheckPaymentDetails extends BasePaymentDetails {
  method: "CHECK"; // Classify the method of payment as "CHECK" for CheckDetails. Allowed value: CHECK
  checkNumber?: string; // Check number
  checkIdentifier?: string; // Check identifier
  name?: string; // Name
  deliveryStatus?: "COMPLETED" | "PENDING" | "SETTLED" | "CANCELED" | "REFUND" | "DECLINED"; // Allowed values: COMPLETED, PENDING, SETTLED, CANCELED, REFUND, DECLINED
  etaTimestamp?: number; // ETA timestamp (>= 1262300400000)
  shippingAddress?: Address; // Model for standardized address. 
}

/**
 * Electronic check payment details
 */
export interface ECheckPaymentDetails extends BasePaymentDetails {
  method: "ECHECK";
  checkNumber: string; // A unique number identifying the eCheck.
  issuerBank: string; //The bank from which the eCheck is issued.
  issuerName?: string; //The name of the person or entity issuing the check.
  issuerId: string; // Identification number of the issuer.
  issueBank: string; // Redundant with issuerBank, specifying the issuing bank.
  issuerAccountNumber: string; // Account number of the issuer.
  beneficiaryName?: string; // The name of the individual or entity receiving the funds.
  beneficiaryId?: string; // Identification number of the beneficiary.
  beneficiaryBank?: string; // The bank of the beneficiary.
  status?: string; // The current status of the eCheck (e.g., pending).
  signature?: string; // A digital signature to validate the eCheck.
  authorizationCode?: string; // A code used for authorizing the eCheck.
  issueDate: string; // The date the eCheck was issued. (required)
  dueDate: string; // The date by which the eCheck must be cashed or deposited. (required)
}

/**
 * Online payment details
 */
export interface OnlinePaymentDetails extends BasePaymentDetails {
  method: "ONLINE_PAYMENT";
  serviceProvider: string; // The company or entity that the payment is being made to (e.g., a utility company).
  accountNumber: string; // The account number associated with the payment.
  invoiceNumber?: string; // The invoice number related to the payment, optional.
  dueDate?: string; // The due date for the payment, optional.
  identificationType?: string; // The type of identification used for the transaction (e.g., DNI), optional.
  identificationName?: string; // The name associated with the identification, optional.
  identificationNumber?: string; // The number associated with the identification, optional.
}

/**
 * Union type for all payment method details
 */
export type PaymentMethodDetails = 
  | CardPaymentDetails
  | BankAccountPaymentDetails
  | IBANPaymentDetails
  | ACHPaymentDetails
  | SWIFTPaymentDetails
  | MpesaPaymentDetails
  | UPIPaymentDetails
  | WalletPaymentDetails
  | CheckPaymentDetails
  | CBUPaymentDetails
  | CVUPaymentDetails
  | ECheckPaymentDetails
  | DEBINPaymentDetails
  | QRCodePaymentDetails
  | OnlinePaymentDetails
  | TEDPaymentDetails
  | BoletoPaymentDetails
  | PIXPaymentDetails;

/**
 * Supported transaction types/payment methods
 */
export type TransactionType =
  | "DEPOSIT"
  | "TRANSFER"
  | "EXTERNAL_PAYMENT"
  | "WITHDRAWAL"
  | "REFUND"
  | "DEBIN"
  | "LOAN"
  | "OTHER";

/**
 * Transaction processing states
 */
export type TransactionState = 
  | "CREATED"     // Transaction has been created
  | "PROCESSING"  // Transaction is being processed
  | "SENT"        // Transaction has been sent
  | "EXPIRED"     // Transaction has expired
  | "DECLINED"    // Transaction was declined
  | "SUSPENDED"   // Transaction is suspended
  | "REFUNDED"    // Transaction has been refunded
  | "SUCCESSFUL"; // Transaction completed successfully

/**
 * Base transaction verification data
 */
export interface BaseVerifyTransaction {
  type: TransactionType; // Transaction type. Allowed values: DEPOSIT, TRANSFER, EXTERNAL_PAYMENT, WITHDRAWAL, REFUND, DEBIN, LOAN, OTHER.
  transactionId?: string; // Unique transaction identifier (>= 1 characters)
  timestamp?: number; // Timestamp of when transaction took place. Set to the moment that Güeno receives the transaction if not provided. Must be expressed in UTC+0 timezone (>= 1262300400000).
  transactionState?: TransactionState; // Model for transaction states. E.g. Processing, Refunded, Successful etc. Set to "CREATED" if not provided. Allowed values: CREATED, PROCESSING, SENT, EXPIRED, DECLINED, SUSPENDED, REFUNDED, SUCCESSFUL.
  originUserId?: string; // UserId for where the transaction originates from
  destinationUserId?: string; // UserId for transaction's destination. In other words, where the value is being transferred to.
  externalOrigin?: boolean; // Indicates if the origin is an external entity. Used to identify when a transaction involves an entity who is not your client. If unknown, do not send it.
  externalDestination?: boolean; // Indicates if the destination is an external entity. Used to identify when a transaction involves an entity who is not your client. If unknown, do not send it.
  destinationAmountDetails?: AmountDetails; // Transaction Amount Detail
  originAmountDetails?: AmountDetails; // Transaction Amount Detail
  originPaymentDetails?: PaymentMethodDetails; // Model for origin payment details (e.g., DEBIN Details)
  destinationPaymentDetails?: PaymentMethodDetails; // Model for destination payment details (e.g., Card Details)
  relatedTransactionIds?: string[]; // IDs of transactions related to this transaction. Ex: refund, split bills.
  productType?: string; // Type of product being used by the consumer (ex: wallets, payments etc)
  promotionCodeUsed?: boolean; // Whether a promotion code was used or not for the transaction
  reference?: string; // Reference field for the transaction indicating the purpose of the transaction etc. (>= 1 characters)
  mcc?: string; // Merchant Category Code
  originDeviceData?: DeviceData; // Model for device data.
  destinationDeviceData?: DeviceData; // Model for device data.
  tags?: Tag[]; // Additional information that can be added via tags
}

/**
 * Complete transaction verification data - now supports mixed payment types
 */
export type VerifyTransaction = BaseVerifyTransaction;

/**
 * Type guards for different payment methods
 */
export const isCardPayment = (payment: PaymentMethodDetails): payment is CardPaymentDetails => {
  return payment.method === "CARD";
};

export const isIBANPayment = (payment: PaymentMethodDetails): payment is IBANPaymentDetails => {
  return payment.method === "IBAN";
};

export const isACHPayment = (payment: PaymentMethodDetails): payment is ACHPaymentDetails => {
  return payment.method === "ACH";
};

export const isSWIFTPayment = (payment: PaymentMethodDetails): payment is SWIFTPaymentDetails => {
  return payment.method === "SWIFT";
};

export const isMPESAPayment = (payment: PaymentMethodDetails): payment is MpesaPaymentDetails => {
  return payment.method === "MPESA";
};

export const isTEDPayment = (payment: PaymentMethodDetails): payment is TEDPaymentDetails => {
  return payment.method === "TED";
};

export const isBOLETOPayment = (payment: PaymentMethodDetails): payment is BoletoPaymentDetails => {
  return payment.method === "BOLETO";
};

export const isPIXPayment = (payment: PaymentMethodDetails): payment is PIXPaymentDetails => {
  return payment.method === "PIX";
};

export const isCBUPayment = (payment: PaymentMethodDetails): payment is CBUPaymentDetails => {
  return payment.method === "CBU";
};

export const isCVUPayment = (payment: PaymentMethodDetails): payment is CVUPaymentDetails => {
  return payment.method === "CVU";
};

export const isDEBINPayment = (payment: PaymentMethodDetails): payment is DEBINPaymentDetails => {
  return payment.method === "DEBIN";
};

export const isQRCodePayment = (payment: PaymentMethodDetails): payment is QRCodePaymentDetails => {
  return payment.method === "QR_CODE";
};

export const isWalletPayment = (payment: PaymentMethodDetails): payment is WalletPaymentDetails => {
  return payment.method === "WALLET";
};

/**
 * Helper function to get required fields for a specific payment type
 */
export const getRequiredFieldsForPaymentType = (paymentMethod: string): string[] => {
  switch (paymentMethod) {
    case "CARD":
      return [
        "cardFingerprint",
        "cardIssuedCountry", 
        "3dsDone",
        "nameOnCard",
        "cardExpiry",
        "cardLast4Digits",
        "cardBrand",
        "cardFunding",
        "cardAuthenticated",
        "cardType",
        "merchantDetails"
      ];
    case "IBAN":
    case "SWIFT":
      return ["bankCode", "accountHolderName"];
    case "ACH":
      return ["accountNumber", "routingNumber", "accountHolderName"];
    case "MPESA":
    case "UPI":
      return ["phoneNumber", "transactionReference"];
    case "PIX":
      return ["pixKey", "pixKeyType"];
    case "BOLETO":
      return ["boletoNumber"];
    case "TED":
      return ["senderBank", "accountNumber"];
    case "CBU":
      return ["cbu"];
    case "CVU":
      return ["cvu"];
    case "DEBIN":
      return ["authorizationCode", "issuerBank", "recipientBank", "expirationDate", "transactionId"];
    case "QR_CODE":
      return ["qrCodeData", "qrCodeType"];
    case "WALLET":
      return ["walletId", "walletType", "provider"];
    default:
      return ["transactionReferenceField"];
  }
};

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Response for consumer creation operations
 */
export interface CreateConsumerResponse {
  success: boolean; // Indicates if the operation was successful
  message: string; // Message describing the result
  data: {
    userId: string;
  };
}

/**
 * Response for consumer retrieval operations
 */
export interface retrieveConsumerResponse {
  success: boolean; // Indicates if the operation was successful
  message: string; // Message describing the result
  data: UserDataParams;
}

/**
 * Response for transaction retrieval operations
 */
export interface retrieveTransactionResponse {
  success: boolean; // Indicates if the operation was successful
  message: string; // Message describing the result
  data: VerifyTransaction;
}

/**
 * Response for consumer event operations
 */
export interface ConsumerEventResponse {
  success: boolean; // Indicates if the operation was successful
  message: string; // Message describing the result
}

/**
 * Response for transaction event operations
 */
export interface TransactionEventResponse {
  success: boolean; // Indicates if the operation was successful
  message: string; // Message describing the result
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Consumer event data structure
 */
export interface ConsumerEvent {
  timestamp: number,
  userId: string,
  eventId: string,
  reason: string,
  eventDescription: string,
  updatedConsumerUserAttributes?: Partial<UserDataParams>
}

/**
 * Transaction event data structure
 */
export interface TransactionEvent {
  timestamp: number,
  transactionId: string,
  eventId: string,
  reason: string,
  eventDescription: string,
  updatedTransactionAttributes: Partial<VerifyTransaction>
}

// ============================================================================
// DEVICE & LOCATION TYPES
// ============================================================================

/**
 * Device information for transaction security
 */
export interface DeviceData {
  batteryLevel?: number;
  deviceLatitude?: number;
  deviceLongitude?: number;
  ipAddress?: string;
  deviceIdentifier?: string;
  vpnUsed?: boolean;
  operatingSystem?: string;
  deviceMaker?: string;
  deviceModel?: string;
  deviceYear?: string;
  appVersion?: string;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

/**
 * Transaction amount details with currency
 */
export interface AmountDetails {
  transactionAmount: number;
  transactionCurrency: string;
  country?: string;
}

/**
 * Type guards for PaymentMethodDetails
 */
export const isGenericBankAccountPayment = (payment: PaymentMethodDetails): payment is BankAccountPaymentDetails => {
  return payment.method === "GENERIC_BANK_ACCOUNT";
};

export const isCheckPayment = (payment: PaymentMethodDetails): payment is CheckPaymentDetails => {
  return payment.method === "CHECK";
};

export const isECheckPayment = (payment: PaymentMethodDetails): payment is ECheckPaymentDetails => {
  return payment.method === "ECHECK";
};

export const isOnlinePayment = (payment: PaymentMethodDetails): payment is OnlinePaymentDetails => {
  return payment.method === "ONLINE_PAYMENT";
};

/**
 * Helper functions for working with mixed payment types
 */
export const getOriginPaymentType = (transaction: VerifyTransaction): string => {
  return transaction.originPaymentDetails?.method || "UNKNOWN";
};

export const getDestinationPaymentType = (transaction: VerifyTransaction): string => {
  return transaction.destinationPaymentDetails?.method || "UNKNOWN";
};

export const isMixedPaymentTransaction = (transaction: VerifyTransaction): boolean => {
  return transaction.originPaymentDetails?.method !== transaction.destinationPaymentDetails?.method;
};

export const isSamePaymentTypeTransaction = (transaction: VerifyTransaction): boolean => {
  return transaction.originPaymentDetails?.method === transaction.destinationPaymentDetails?.method;
};

/**
 * Generic type guards for checking payment types in transactions
 */
export const hasPaymentTypeOrigin = (transaction: VerifyTransaction, paymentType: string): boolean => {
  return transaction.originPaymentDetails?.method === paymentType;
};

export const hasPaymentTypeDestination = (transaction: VerifyTransaction, paymentType: string): boolean => {
  return transaction.destinationPaymentDetails?.method === paymentType;
};

export const hasPaymentType = (transaction: VerifyTransaction, paymentType: string): boolean => {
  return hasPaymentTypeOrigin(transaction, paymentType) || hasPaymentTypeDestination(transaction, paymentType);
};

/**
 * Get all payment types involved in a transaction
 */
export const getTransactionPaymentTypes = (transaction: VerifyTransaction): string[] => {
  const types = new Set<string>();
  if (transaction.originPaymentDetails?.method) {
    types.add(transaction.originPaymentDetails.method);
  }
  if (transaction.destinationPaymentDetails?.method) {
    types.add(transaction.destinationPaymentDetails.method);
  }
  return Array.from(types);
};

/**
 * Check if transaction involves specific payment type combinations
 */
export const hasPaymentTypeCombination = (
  transaction: VerifyTransaction, 
  originType: string, 
  destinationType: string
): boolean => {
  return hasPaymentTypeOrigin(transaction, originType) && hasPaymentTypeDestination(transaction, destinationType);
};

/**
 * Get payment details with type safety
 */
export const getOriginPaymentDetails = <T extends PaymentMethodDetails>(
  transaction: VerifyTransaction,
  typeGuard: (payment: PaymentMethodDetails) => payment is T
): T | null => {
  return transaction.originPaymentDetails && typeGuard(transaction.originPaymentDetails) ? transaction.originPaymentDetails : null;
};

export const getDestinationPaymentDetails = <T extends PaymentMethodDetails>(
  transaction: VerifyTransaction,
  typeGuard: (payment: PaymentMethodDetails) => payment is T
): T | null => {
  return transaction.destinationPaymentDetails && typeGuard(transaction.destinationPaymentDetails) ? transaction.destinationPaymentDetails : null;
};

/**
 * Validate transaction payment type consistency
 */
export const validateTransactionPaymentTypes = (transaction: VerifyTransaction): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Check if payment methods are valid by checking against known payment methods
  const validPaymentMethods = [
    "CARD", "GENERIC_BANK_ACCOUNT", "IBAN", "ACH", "SWIFT", "MPESA", "UPI", 
    "WALLET", "QR_CODE", "TED", "BOLETO", "PIX", "CBU", "CVU", "DEBIN", 
    "CHECK", "ECHECK", "ONLINE_PAYMENT"
  ];
  
  if (transaction.originPaymentDetails?.method && !validPaymentMethods.includes(transaction.originPaymentDetails.method)) {
    errors.push(`Invalid origin payment method: ${transaction.originPaymentDetails.method}`);
  }
  
  if (transaction.destinationPaymentDetails?.method && !validPaymentMethods.includes(transaction.destinationPaymentDetails.method)) {
    errors.push(`Invalid destination payment method: ${transaction.destinationPaymentDetails.method}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get transaction summary
 */
export const getTransactionSummary = (transaction: VerifyTransaction): {
  primaryType: TransactionType;
  originType: string;
  destinationType: string;
  isMixed: boolean;
  paymentTypes: string[];
  amount: number;
  currency: string;
} => {
  return {
    primaryType: transaction.type,
    originType: getOriginPaymentType(transaction),
    destinationType: getDestinationPaymentType(transaction),
    isMixed: isMixedPaymentTransaction(transaction),
    paymentTypes: getTransactionPaymentTypes(transaction),
    amount: transaction.destinationAmountDetails?.transactionAmount || 0,
    currency: transaction.destinationAmountDetails?.transactionCurrency || "USD"
  };
};