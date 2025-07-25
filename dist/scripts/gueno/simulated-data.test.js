"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulatedCRYPTOTransaction = exports.simulatedIBANTransaction = exports.simulatedTransaction = exports.testUser = void 0;
exports.testUser = {
    userId: `jm-test-user-${Date.now()}`,
    createdTimestamp: Math.floor(Date.now()),
    userDetails: {
        name: {
            firstName: "John",
            lastName: "Test",
        },
        countryOfResidence: "US",
        countryOfNationality: "US",
        dateOfBirth: "1985-05-15",
        gender: "M",
    },
    userStateDetails: {
        state: "ACTIVE",
    },
    kycStatusDetails: {
        status: "SUCCESSFUL",
    },
    legalDocuments: [
        {
            documentType: "national_identity_card",
            documentNumber: "ABC123456",
            documentIssuedCountry: "US",
        },
    ],
    contactDetails: {
        emailIds: ["john.test@example.com"],
        contactNumbers: ["+14155552671"],
    },
    transactionLimits: {
        maximumDailyTransactionLimit: {
            amountValue: 500,
            amountCurrency: "USD",
        },
        paymentMethodLimits: {
            CARD: {
                transactionCountLimit: {
                    day: 10,
                },
                transactionAmountLimit: {
                    day: {
                        amountValue: 500,
                        amountCurrency: "USD",
                    },
                },
                averageTransactionAmountLimit: {
                    day: {
                        amountValue: 50,
                        amountCurrency: "USD",
                    },
                },
            },
        },
    },
    riskLevel: "LOW",
    acquisitionChannel: "ORGANIC",
    reasonForAccountOpening: ["TESTING"],
    userSegment: "RETAIL",
    pepStatus: [
        {
            isPepHit: false,
            pepCountry: "US",
        },
    ],
    tags: [
        {
            key: "test",
            value: "true",
        },
        {
            key: "source",
            value: "automated_test",
        },
    ],
};
exports.simulatedTransaction = {
    type: "TRANSFER",
    transactionId: `jm-test-transaction-${Math.floor(Date.now())}`,
    timestamp: Math.floor(Date.now()),
    // originUserId: "test-user-1750082498330",
    originUserId: "jm-test-user-1751927326539",
    destinationAmountDetails: {
        transactionAmount: Math.random() * 1000,
        transactionCurrency: "USD",
        country: "US"
    },
    originAmountDetails: {
        transactionAmount: Math.random() * 1000,
        transactionCurrency: "USD",
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
        cardExpiry: {
            month: "12",
            year: "2027"
        },
        cardLast4Digits: "1234",
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
        method: "CARD",
        cardFingerprint: "fp_dest_xyz789abc123",
        cardIssuedCountry: "US",
        transactionReferenceField: "ref_dest_456",
        "3dsDone": false,
        nameOnCard: {
            firstName: "Jane",
            lastName: "Smith"
        },
        cardExpiry: {
            month: "8",
            year: "2026"
        },
        cardLast4Digits: "58",
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
            value: "unknown"
        },
        {
            key: "compliance_status",
            value: "pending"
        }
    ],
};
exports.simulatedIBANTransaction = {
    type: "DEPOSIT",
    transactionId: `jm-test-transaction-${Math.floor(Date.now())}`,
    timestamp: Math.floor(Date.now()),
    //originUserId: "jm-test-user-1751995035686",
    destinationUserId: "jm-test-user-1752852862244",
    destinationAmountDetails: {
        transactionAmount: 4965,
        transactionCurrency: "EUR",
        country: "US"
    },
    originAmountDetails: {
        transactionAmount: 4969,
        transactionCurrency: "EUR",
        country: "US"
    },
    originPaymentDetails: {
        // method: "IBAN",
        method: "IBAN",
        IBAN: "DE89370400440532013000",
        name: "John Test",
        bankName: "Deutsche Bank",
        country: "BR",
        tags: []
        // routingNumber: "12345678290",
        // accountNumber: "31234567890",
        // bankName: "Bank of America",
    },
    destinationPaymentDetails: {
        method: "IBAN",
        IBAN: "DE89370400440532013001",
        name: "John Test",
        bankName: "Deutsche Bank",
        country: "BR",
        tags: []
        // routingNumber: "12345367890",
        // accountNumber: "12145678290",
        // bankName: "Bank of America",
    },
    tags: [
        {
            key: "isFirstTransaction",
            value: "false"
        },
        {
            key: "isThirdPartyTransaction",
            value: "true"
        },
        {
            key: "isTransactionFromCompany",
            value: "true"
        }
    ]
};
exports.simulatedCRYPTOTransaction = {
    type: "WITHDRAWAL",
    transactionId: `jm-test-transaction-${Math.floor(Date.now())}`,
    timestamp: Math.floor(Date.now()),
    //originUserId: "jm-test-user-1751995035686",
    destinationUserId: "jm-test-user-1752092338147",
    destinationAmountDetails: {
        transactionAmount: 298,
        transactionCurrency: "EUR",
        country: "US"
    },
    originAmountDetails: {
        transactionAmount: 350,
        transactionCurrency: "EUR",
        country: "US"
    },
    originPaymentDetails: {
        // method: "IBAN",
        method: "WALLET",
        walletType: "CRYPTO",
        walletId: "1234567890",
    },
    destinationPaymentDetails: {
        method: "WALLET",
        walletType: "CRYPTO",
        walletId: "4234567890",
        tags: []
    },
    tags: [
        {
            key: "isFirstTransaction",
            value: "false"
        },
        {
            key: "isThirdPartyTransaction",
            value: "false"
        },
        {
            key: "previousTransactionType",
            value: "ACH"
        }
    ],
};
