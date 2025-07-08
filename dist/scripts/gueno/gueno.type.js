"use strict";
// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = exports.validateTransactionPaymentTypes = exports.getDestinationPaymentDetails = exports.getOriginPaymentDetails = exports.hasPaymentTypeCombination = exports.getTransactionPaymentTypes = exports.hasPaymentType = exports.hasPaymentTypeDestination = exports.hasPaymentTypeOrigin = exports.isSamePaymentTypeTransaction = exports.isMixedPaymentTransaction = exports.getDestinationPaymentType = exports.getOriginPaymentType = exports.isOnlinePayment = exports.isECheckPayment = exports.isCheckPayment = exports.isGenericBankAccountPayment = exports.getRequiredFieldsForPaymentType = exports.isWalletPayment = exports.isQRCodePayment = exports.isDEBINPayment = exports.isCVUPayment = exports.isCBUPayment = exports.isPIXPayment = exports.isBOLETOPayment = exports.isTEDPayment = exports.isMPESAPayment = exports.isSWIFTPayment = exports.isACHPayment = exports.isIBANPayment = exports.isCardPayment = void 0;
/**
 * Type guards for different payment methods
 */
const isCardPayment = (payment) => {
    return payment.method === "CARD";
};
exports.isCardPayment = isCardPayment;
const isIBANPayment = (payment) => {
    return payment.method === "IBAN";
};
exports.isIBANPayment = isIBANPayment;
const isACHPayment = (payment) => {
    return payment.method === "ACH";
};
exports.isACHPayment = isACHPayment;
const isSWIFTPayment = (payment) => {
    return payment.method === "SWIFT";
};
exports.isSWIFTPayment = isSWIFTPayment;
const isMPESAPayment = (payment) => {
    return payment.method === "MPESA";
};
exports.isMPESAPayment = isMPESAPayment;
const isTEDPayment = (payment) => {
    return payment.method === "TED";
};
exports.isTEDPayment = isTEDPayment;
const isBOLETOPayment = (payment) => {
    return payment.method === "BOLETO";
};
exports.isBOLETOPayment = isBOLETOPayment;
const isPIXPayment = (payment) => {
    return payment.method === "PIX";
};
exports.isPIXPayment = isPIXPayment;
const isCBUPayment = (payment) => {
    return payment.method === "CBU";
};
exports.isCBUPayment = isCBUPayment;
const isCVUPayment = (payment) => {
    return payment.method === "CVU";
};
exports.isCVUPayment = isCVUPayment;
const isDEBINPayment = (payment) => {
    return payment.method === "DEBIN";
};
exports.isDEBINPayment = isDEBINPayment;
const isQRCodePayment = (payment) => {
    return payment.method === "QR_CODE";
};
exports.isQRCodePayment = isQRCodePayment;
const isWalletPayment = (payment) => {
    return payment.method === "WALLET";
};
exports.isWalletPayment = isWalletPayment;
/**
 * Helper function to get required fields for a specific payment type
 */
const getRequiredFieldsForPaymentType = (paymentMethod) => {
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
exports.getRequiredFieldsForPaymentType = getRequiredFieldsForPaymentType;
/**
 * Type guards for PaymentMethodDetails
 */
const isGenericBankAccountPayment = (payment) => {
    return payment.method === "GENERIC_BANK_ACCOUNT";
};
exports.isGenericBankAccountPayment = isGenericBankAccountPayment;
const isCheckPayment = (payment) => {
    return payment.method === "CHECK";
};
exports.isCheckPayment = isCheckPayment;
const isECheckPayment = (payment) => {
    return payment.method === "ECHECK";
};
exports.isECheckPayment = isECheckPayment;
const isOnlinePayment = (payment) => {
    return payment.method === "ONLINE_PAYMENT";
};
exports.isOnlinePayment = isOnlinePayment;
/**
 * Helper functions for working with mixed payment types
 */
const getOriginPaymentType = (transaction) => {
    var _a;
    return ((_a = transaction.originPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) || "UNKNOWN";
};
exports.getOriginPaymentType = getOriginPaymentType;
const getDestinationPaymentType = (transaction) => {
    var _a;
    return ((_a = transaction.destinationPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) || "UNKNOWN";
};
exports.getDestinationPaymentType = getDestinationPaymentType;
const isMixedPaymentTransaction = (transaction) => {
    var _a, _b;
    return ((_a = transaction.originPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) !== ((_b = transaction.destinationPaymentDetails) === null || _b === void 0 ? void 0 : _b.method);
};
exports.isMixedPaymentTransaction = isMixedPaymentTransaction;
const isSamePaymentTypeTransaction = (transaction) => {
    var _a, _b;
    return ((_a = transaction.originPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) === ((_b = transaction.destinationPaymentDetails) === null || _b === void 0 ? void 0 : _b.method);
};
exports.isSamePaymentTypeTransaction = isSamePaymentTypeTransaction;
/**
 * Generic type guards for checking payment types in transactions
 */
const hasPaymentTypeOrigin = (transaction, paymentType) => {
    var _a;
    return ((_a = transaction.originPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) === paymentType;
};
exports.hasPaymentTypeOrigin = hasPaymentTypeOrigin;
const hasPaymentTypeDestination = (transaction, paymentType) => {
    var _a;
    return ((_a = transaction.destinationPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) === paymentType;
};
exports.hasPaymentTypeDestination = hasPaymentTypeDestination;
const hasPaymentType = (transaction, paymentType) => {
    return (0, exports.hasPaymentTypeOrigin)(transaction, paymentType) || (0, exports.hasPaymentTypeDestination)(transaction, paymentType);
};
exports.hasPaymentType = hasPaymentType;
/**
 * Get all payment types involved in a transaction
 */
const getTransactionPaymentTypes = (transaction) => {
    var _a, _b;
    const types = new Set();
    if ((_a = transaction.originPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) {
        types.add(transaction.originPaymentDetails.method);
    }
    if ((_b = transaction.destinationPaymentDetails) === null || _b === void 0 ? void 0 : _b.method) {
        types.add(transaction.destinationPaymentDetails.method);
    }
    return Array.from(types);
};
exports.getTransactionPaymentTypes = getTransactionPaymentTypes;
/**
 * Check if transaction involves specific payment type combinations
 */
const hasPaymentTypeCombination = (transaction, originType, destinationType) => {
    return (0, exports.hasPaymentTypeOrigin)(transaction, originType) && (0, exports.hasPaymentTypeDestination)(transaction, destinationType);
};
exports.hasPaymentTypeCombination = hasPaymentTypeCombination;
/**
 * Get payment details with type safety
 */
const getOriginPaymentDetails = (transaction, typeGuard) => {
    return transaction.originPaymentDetails && typeGuard(transaction.originPaymentDetails) ? transaction.originPaymentDetails : null;
};
exports.getOriginPaymentDetails = getOriginPaymentDetails;
const getDestinationPaymentDetails = (transaction, typeGuard) => {
    return transaction.destinationPaymentDetails && typeGuard(transaction.destinationPaymentDetails) ? transaction.destinationPaymentDetails : null;
};
exports.getDestinationPaymentDetails = getDestinationPaymentDetails;
/**
 * Validate transaction payment type consistency
 */
const validateTransactionPaymentTypes = (transaction) => {
    var _a, _b;
    const errors = [];
    // Check if payment methods are valid by checking against known payment methods
    const validPaymentMethods = [
        "CARD", "GENERIC_BANK_ACCOUNT", "IBAN", "ACH", "SWIFT", "MPESA", "UPI",
        "WALLET", "QR_CODE", "TED", "BOLETO", "PIX", "CBU", "CVU", "DEBIN",
        "CHECK", "ECHECK", "ONLINE_PAYMENT"
    ];
    if (((_a = transaction.originPaymentDetails) === null || _a === void 0 ? void 0 : _a.method) && !validPaymentMethods.includes(transaction.originPaymentDetails.method)) {
        errors.push(`Invalid origin payment method: ${transaction.originPaymentDetails.method}`);
    }
    if (((_b = transaction.destinationPaymentDetails) === null || _b === void 0 ? void 0 : _b.method) && !validPaymentMethods.includes(transaction.destinationPaymentDetails.method)) {
        errors.push(`Invalid destination payment method: ${transaction.destinationPaymentDetails.method}`);
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateTransactionPaymentTypes = validateTransactionPaymentTypes;
/**
 * Get transaction summary
 */
const getTransactionSummary = (transaction) => {
    var _a, _b;
    return {
        primaryType: transaction.type,
        originType: (0, exports.getOriginPaymentType)(transaction),
        destinationType: (0, exports.getDestinationPaymentType)(transaction),
        isMixed: (0, exports.isMixedPaymentTransaction)(transaction),
        paymentTypes: (0, exports.getTransactionPaymentTypes)(transaction),
        amount: ((_a = transaction.destinationAmountDetails) === null || _a === void 0 ? void 0 : _a.transactionAmount) || 0,
        currency: ((_b = transaction.destinationAmountDetails) === null || _b === void 0 ? void 0 : _b.transactionCurrency) || "USD"
    };
};
exports.getTransactionSummary = getTransactionSummary;
