"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSimulatedTransactions = exports.simulatedWithdrawalTransaction = exports.simulatedDepositTransaction = exports.simulatedTransaction = void 0;
exports.simulatedTransaction = {
    type: "TRANSFER",
    transactionId: "TXN_20241201_001234567890",
    timestamp: 1701388800000,
    transactionState: "SUCCESSFUL",
    originUserId: "USER_ORIGIN_12345",
    destinationUserId: "USER_DEST_67890",
    externalOrigin: false,
    externalDestination: false,
    destinationAmountDetails: {
        transactionAmount: 1000.00,
        amountCurrency: "USD",
        country: "US"
    },
    originAmountDetails: {
        transactionAmount: 1000.00,
        amountCurrency: "USD",
        country: "US"
    },
    originPaymentDetails: {
        method: "CARD",
        cardFingerprint: "fp_origin_abc123def456",
        cardIssuedCountry: "US",
        transactionReferenceField: "ref_origin_789",
        "3dsDone": true,
        nameOnCard: {
            firstName: "John",
            middleName: "Michael",
            lastName: "Doe"
        },
        cardExpirity: {
            month: 12,
            year: 2025
        },
        cardLastDigits: "1234",
        cardBrand: "VISA",
        cardFunding: "DEBIT",
        cardAuthenticated: true,
        paymentChannel: "ONLINE",
        cardType: "VIRTUAL",
        merchantDetails: {
            id: "MERCHANT_001",
            category: "FINANCIAL_SERVICES",
            MCC: "6011",
            city: "New York",
            country: "US",
            state: "NY",
            postCode: "10001"
        }
    },
    destinationPaymentDetails: {
        method: "BANK_TRANSFER",
        cardFingerprint: "fp_dest_xyz789abc123",
        cardIssuedCountry: "US",
        transactionReferenceField: "ref_dest_456",
        "3dsDone": false,
        nameOnCard: {
            firstName: "Jane",
            lastName: "Smith"
        },
        cardExpirity: {
            month: 8,
            year: 2026
        },
        cardLastDigits: "5678",
        cardBrand: "MASTERCARD",
        cardFunding: "CREDIT",
        cardAuthenticated: true,
        paymentChannel: "MOBILE",
        cardType: "PHYSICAL",
        merchantDetails: {
            id: "MERCHANT_002",
            category: "RETAIL",
            MCC: "5411",
            city: "Los Angeles",
            country: "US",
            state: "CA",
            postCode: "90210"
        }
    },
    relatedTransactionId: "TXN_20241201_001234567889",
    productType: "PERSONAL_TRANSFER",
    promotionCodeUser: "PROMO_SAVE10",
    reference: "REF_20241201_001",
    mcc: "6011",
    originDeviceData: {
        batteryLevel: 85,
        deviceLatitude: 40.7128,
        deviceLongitude: -74.0060,
        ipAddress: "192.168.1.100",
        deviceIdentifier: "device_origin_001",
        vpnUsed: false,
        operatingSystem: "iOS 17.1",
        deviceMaker: "Apple",
        deviceModel: "iPhone 15 Pro",
        deviceYear: "2023",
        appVersion: "2.1.0"
    },
    destinationDeviceData: {
        batteryLevel: 92,
        deviceLatitude: 34.0522,
        deviceLongitude: -118.2437,
        ipAddress: "192.168.1.200",
        deviceIdentifier: "device_dest_002",
        vpnUsed: true,
        operatingSystem: "Android 14",
        deviceMaker: "Samsung",
        deviceModel: "Galaxy S23",
        deviceYear: "2023",
        appVersion: "2.1.0"
    },
    tags: [
        {
            key: "transaction_category",
            value: "peer_to_peer"
        },
        {
            key: "risk_level",
            value: "low"
        },
        {
            key: "compliance_status",
            value: "approved"
        }
    ]
};
// Additional simulated transactions for different scenarios
exports.simulatedDepositTransaction = {
    type: "DEPOSIT",
    transactionId: "TXN_20241201_002345678901",
    timestamp: 1701392400000,
    transactionState: "PROCESSING",
    originUserId: "EXTERNAL_BANK_001",
    destinationUserId: "USER_DEST_67890",
    externalOrigin: true,
    externalDestination: false,
    destinationAmountDetails: {
        transactionAmount: 2500.00,
        amountCurrency: "USD",
        country: "US"
    },
    originAmountDetails: {
        transactionAmount: 2500.00,
        amountCurrency: "USD",
        country: "US"
    },
    originPaymentDetails: {
        method: "BANK_TRANSFER",
        nameOnCard: {
            firstName: "Bank",
            lastName: "Transfer"
        },
        cardBrand: "VISA",
        cardAuthenticated: true,
        paymentChannel: "BANK_API"
    },
    destinationPaymentDetails: {
        method: "INTERNAL_ACCOUNT",
        nameOnCard: {
            firstName: "Jane",
            lastName: "Smith"
        },
        cardBrand: "VISA",
        cardAuthenticated: true,
        paymentChannel: "INTERNAL"
    },
    reference: "REF_20241201_002",
    tags: [
        {
            key: "transaction_category",
            value: "deposit"
        },
        {
            key: "source",
            value: "external_bank"
        }
    ]
};
exports.simulatedWithdrawalTransaction = {
    type: "WITHDRAWAL",
    transactionId: "TXN_20241201_003456789012",
    timestamp: 1701396000000,
    transactionState: "SUCCESSFUL",
    originUserId: "USER_ORIGIN_12345",
    destinationUserId: "EXTERNAL_BANK_002",
    externalOrigin: false,
    externalDestination: true,
    destinationAmountDetails: {
        transactionAmount: 500.00,
        amountCurrency: "USD",
        country: "US"
    },
    originAmountDetails: {
        transactionAmount: 500.00,
        amountCurrency: "USD",
        country: "US"
    },
    originPaymentDetails: {
        method: "INTERNAL_ACCOUNT",
        nameOnCard: {
            firstName: "John",
            lastName: "Doe"
        },
        cardBrand: "VISA",
        cardAuthenticated: true,
        paymentChannel: "INTERNAL"
    },
    destinationPaymentDetails: {
        method: "BANK_TRANSFER",
        nameOnCard: {
            firstName: "External",
            lastName: "Bank"
        },
        cardBrand: "VISA",
        cardAuthenticated: true,
        paymentChannel: "BANK_API"
    },
    reference: "REF_20241201_003",
    tags: [
        {
            key: "transaction_category",
            value: "withdrawal"
        },
        {
            key: "destination",
            value: "external_bank"
        }
    ]
};
// Export all simulated transactions
exports.allSimulatedTransactions = [
    exports.simulatedTransaction,
    exports.simulatedDepositTransaction,
    exports.simulatedWithdrawalTransaction
];
