-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CC', 'CE', 'PP', 'CI_VE', 'NIT', 'PPT', 'SSN', 'CUIT', 'CUIL', 'CI', 'CPF', 'CNPJ', 'PASS', 'RUT', 'CR', 'CJ', 'RN', 'RUC', 'DNI', 'CURP', 'CURPE', 'ID', 'DE', 'RIF', 'NONE');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('AHORROS', 'CORRIENTE', 'MASTER', 'VISTA');

-- CreateEnum
CREATE TYPE "StellarTransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PAYMENT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('CREATED', 'SENT', 'EXPIRED', 'CANCELLED', 'PAID');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'USER_PAYMENT', 'PAYMENT', 'BILL_PAYMENT', 'BLOCK_FUNDS', 'UNBLOCK_FUNDS', 'GIFT_CLAIMED', 'EXCHANGE', 'PAYMENT_LINK', 'PAYROLL', 'USD_BANK_OPENING_FEE_PAYMENT', 'USD_BANK_DEPOSIT', 'EUR_BANK_DEPOSIT', 'USD_BANK_MICRODEPOSIT', 'ADD_FUNDS_TO_CARD', 'REMOVE_FUNDS_FROM_CARD', 'VIRTUAL_CARD_ISSUING_FEE_PAYMENT', 'DEPOSIT_TO_DEFI', 'WITHDRAW_FROM_DEFI', 'CARD_TRANSACTION', 'CASHBACK', 'PHYSICAL_CARD_ISSUING_FEE_PAYMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PSE', 'PAYPAL', 'BANK_TRANSFER', 'CREDIT_CARD', 'ZELLE', 'CRYPTO', 'INTERNAL_BALANCE', 'CASH', 'YIELD_EARNINGS', 'REWARDS', 'PAYROLL', 'USD_BANK_PAYMENT', 'USD_BANK_MICRODEPOSIT', 'EUR_BANK_PAYMENT', 'MONEYGRAM', 'WISE', 'LOCAL_PAYMENT_METHOD', 'PAYMENT_LINK_CREDIT_CARD', 'BR_PIX', 'VE_PAGO_MOVIL', 'VE_C2P', 'BUY_CRYPTO', 'CASHBACK', 'BO_QR_CODE', 'BO_YAPE', 'KOYWE', 'AR_QR_CODE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PENDING_APPROVAL', 'ON_HOLD', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REVERSED', 'REJECTED', 'FAILED', 'EXPIRED', 'CREATED', 'READY_TO_PICKUP', 'REFUNDED', 'AUTHORIZED', 'DECLINE', 'INTERNAL_AWAITING_FUNDS', 'INTERNAL_FUNDS_SENT', 'SENT_TO_PARTNER', 'FIAT_FUNDS_RECEIVED', 'FIAT_FUNDS_PENDING', 'SCREENING', 'SCREENED', 'ASSIGNED');

-- CreateEnum
CREATE TYPE "CashPaymentStatus" AS ENUM ('CREATED', 'PENDING', 'COMPLETED', 'CANCELLED', 'REVERSED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MigrationState" AS ENUM ('CREATED', 'ACCOUNT_CREATED', 'PENDING_BALANCE_CLAIMED', 'YUSDC_TO_USDC_TRADED', 'OLD_BALANCE_MIGRATED', 'NOT_NECESSARY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "UsdBankAccountRequestStatus" AS ENUM ('REQUEST_TOS_ACCEPTANCE', 'TOS_ACCEPTED', 'CUSTOMER_CREATED', 'CUSTOMER_CREATION_ERROR', 'KYC_DOCUMENTS_SENT', 'CREATED', 'MAX_ATTEMPTS_REACHED', 'PROVIDER_REJECTED', 'UNDER_PROVIDER_REVIEW', 'AWAITING_QUESTIONARY');

-- CreateEnum
CREATE TYPE "CardRequestStatus" AS ENUM ('PROOF_OF_RESIDENCY_SENT', 'IN_REVIEW', 'CUSTOMER_CREATED', 'OPENING_FEE_PAID', 'ISSUED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccountRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "CardProvider" AS ENUM ('RAIN', 'BAN_TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionSubStatus" AS ENUM ('COMPLIANCE_CHECK', 'INTERNAL_ERROR', 'SCREENING_PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "ComplianceCheckingStatus" AS ENUM ('BLOCK', 'ALLOW', 'FLAG', 'SUSPEND');

-- CreateEnum
CREATE TYPE "Platfom" AS ENUM ('ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "TreasuryTransactionStatus" AS ENUM ('CREATED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TreasuryAddressDestination" AS ENUM ('CIRCLE', 'FIREBLOCKS', 'INTERNAL', 'PAYPAL', 'CHASE');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('CREATED', 'PROCESSING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PayrollItemStatus" AS ENUM ('CREATED', 'PROCESSING', 'COMPLETED', 'NOT_USER_FOUND', 'FAILED');

-- CreateEnum
CREATE TYPE "UsdBankAccountStatus" AS ENUM ('ACTIVE', 'DEACTIVE');

-- CreateEnum
CREATE TYPE "PayIdStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AccountLimitPeriod" AS ENUM ('ONE_TIME', 'DAILY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('VIRTUAL', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ISSUED_INACTIVE', 'ACTIVE', 'LOST', 'STOLEN_CARD', 'WITHDRAWALS', 'CLOSED', 'LOST_NOT_CAP', 'STOLEN_NOT_CAP', 'INACTIVE', 'CARD_REISSUE', 'BLOCK_PER_FRAUD');

-- CreateEnum
CREATE TYPE "WisePaymentLinkStatus" AS ENUM ('REQUESTED', 'ASSIGNED', 'REFERENCE_NUMBER_ASSIGNED', 'PAID', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('STELLAR', 'POLYGON', 'TRON', 'BITCOIN', 'ETHEREUM', 'SOLANA');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('HOURLY', 'FIXED');

-- CreateEnum
CREATE TYPE "MoneyFlowSourceType" AS ENUM ('USD_BANK_ACCOUNT', 'PAYROLL', 'ALL');

-- CreateEnum
CREATE TYPE "MoneyFlowDestinationType" AS ENUM ('BANK_ACCOUNT', 'CRYPTO_WALLET', 'CARD', 'USD_MERU_ACCOUNT', 'USER_PAYMENT', 'UTILITY_BILL_PAYMENT');

-- CreateEnum
CREATE TYPE "MoneyFlowExecutionStatus" AS ENUM ('CREATED', 'PROCESSING', 'EXECUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "MoneyFlowExecutionStepStatus" AS ENUM ('CREATED', 'PROCESSING', 'TRIGGERED', 'EXECUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "BoYapePaymentStatus" AS ENUM ('CREATED', 'PENDING_CONFIRMATION', 'EXPIRED', 'CANCELLED', 'PAID');

-- CreateEnum
CREATE TYPE "VEDocumentType" AS ENUM ('V', 'E', 'J');

-- CreateEnum
CREATE TYPE "MantecaBankAccountSatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'DELETED');

-- CreateEnum
CREATE TYPE "IbanAccountRequestStatus" AS ENUM ('CREATED', 'REQUESTED', 'PROOF_OF_ADDRESS_REJECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BlindpayUsBankAccountRequestStatus" AS ENUM ('REQUESTED', 'CUSTOMER_CREATED', 'IN_PROGRESS', 'CUSTOMER_APPROVED', 'CUSTOMER_REJECTED', 'WALLET_CREATED', 'BANK_ACCOUNT_CREATED', 'TOS_ACCEPTED', 'FAILED', 'WRONG_DOCUMENT');

-- CreateEnum
CREATE TYPE "PhysicalCardRequestStatus" AS ENUM ('PENDING', 'CARD_CREATED', 'PROCESSING', 'SHIPPING_CREATED', 'SHIPPING_LABEL_CREATED', 'SHIPPING_LABEL_CREATION_FAILED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "ArQrCodePaymentStatus" AS ENUM ('CREATED', 'STARTING', 'ACTIVE', 'WAITING', 'PAUSED', 'FAILED', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "stellarAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSignin" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "country" TEXT,
    "avatarUrl" TEXT,
    "kycCompleted" BOOLEAN DEFAULT false,
    "kycStatus" TEXT,
    "kycLastUpdate" TIMESTAMP(3),
    "blocked" BOOLEAN,
    "paypalConfirmed" BOOLEAN,
    "referralId" TEXT,
    "referralGiftClaimed" BOOLEAN DEFAULT false,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "paypalWarningShowed" BOOLEAN NOT NULL DEFAULT false,
    "welcomeGiftClaimed" BOOLEAN DEFAULT false,
    "ccEnabled" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "phoneIsVerified" BOOLEAN DEFAULT false,
    "kycCustomerId" TEXT,
    "blockReason" TEXT,
    "isBusiness" BOOLEAN DEFAULT false,
    "isNonCustodial" BOOLEAN DEFAULT false,
    "shouldConfigureAccount" BOOLEAN DEFAULT false,
    "migrationState" "MigrationState" DEFAULT 'CREATED',
    "mainCurrency" TEXT,
    "usdBankAccountRequestStatus" "UsdBankAccountRequestStatus",
    "usdBankAccountRequested" BOOLEAN,
    "usdBankAccountRequestsAttempts" INTEGER DEFAULT 0,
    "usdBankAccountOpeningFeePaid" BOOLEAN NOT NULL DEFAULT false,
    "meruTermsAndConditionsAccepted" BOOLEAN DEFAULT false,
    "addressVerified" BOOLEAN DEFAULT false,
    "addressVerificationStatus" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "accountRiskLevel" "AccountRiskLevel" NOT NULL DEFAULT 'LOW',
    "accountRiskComment" TEXT,
    "paypalWithoutLimits" BOOLEAN DEFAULT false,
    "cardRequestStatus" "CardRequestStatus",
    "banxaKYCShared" BOOLEAN DEFAULT false,
    "virtualCardRequestFeePaid" BOOLEAN DEFAULT false,
    "hasDeFiEnabled" BOOLEAN DEFAULT false,
    "shouldAskKYC" BOOLEAN DEFAULT false,
    "shouldAskProofOfResidence" BOOLEAN DEFAULT false,
    "hasPaymentLinksEnabled" BOOLEAN DEFAULT false,
    "portalUserId" TEXT,
    "hasPSEEnabled" BOOLEAN DEFAULT false,
    "hasWeb3Enabled" BOOLEAN DEFAULT false,
    "pagoMovilPhoneNumber" TEXT,
    "mantecaTermsAndConditionsAccepted" BOOLEAN DEFAULT false,
    "hasAbandonedKYCProcess" BOOLEAN DEFAULT false,
    "kycDeclineReason" TEXT,
    "kycDuplicatedWithUserId" TEXT,
    "lastSigninIpAddress" TEXT,
    "accessedWithMFA" BOOLEAN DEFAULT false,
    "pinAttempts" INTEGER DEFAULT 0,
    "pinBlocked" BOOLEAN DEFAULT false,
    "shouldAskChangePassword" BOOLEAN DEFAULT false,
    "accessedWithMagicLink" BOOLEAN DEFAULT false,
    "hasEmailMFAEnabled" BOOLEAN DEFAULT false,
    "blendVersion" TEXT,
    "appsFlyerUID" TEXT,
    "guenoUserId" TEXT,
    "lastPasswordChangeAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StellarAccount" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "StellarAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" "DocumentType",
    "documentNumber" TEXT,
    "documentExpirationDate" TIMESTAMP(3),
    "documentExpeditionDate" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "secondLastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "city" TEXT,
    "dateOfBirth" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionSupport" (
    "id" TEXT NOT NULL,
    "stellarTransactionId" TEXT NOT NULL,
    "transactionSupportUrl" TEXT NOT NULL,
    "stellarTrasactionType" "StellarTransactionType" NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL,

    CONSTRAINT "TransactionSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DECIMAL(35,8) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "accountType" "BankAccountType" NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isExternal" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT,
    "bankCode" TEXT,
    "beneficiaryAddress" TEXT,
    "beneficiaryType" TEXT,
    "vitaRawData" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "externalProviderId" TEXT,
    "externalBankName" TEXT,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" "TransactionStatus",
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stellarTransactionId" TEXT,
    "amount" DECIMAL(35,8) NOT NULL,
    "extraData" TEXT,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareUrl" TEXT NOT NULL,

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL,
    "tax" DECIMAL(35,8) NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payeerUserId" TEXT,
    "amount" DECIMAL(35,8) NOT NULL,
    "tax" DECIMAL(35,8) NOT NULL DEFAULT 0,
    "description" TEXT,
    "paymentLinkId" TEXT NOT NULL,
    "payeerEmail" TEXT,
    "payeerFullName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'CREATED',
    "transactionId" TEXT,
    "invoiceNumber" TEXT,
    "tipAmount" DECIMAL(35,8) DEFAULT 0,
    "feesPaidByPayeer" BOOLEAN DEFAULT false,
    "ipAddressCreation" TEXT,
    "ipAddressPayment" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stellarTransactionId" TEXT,
    "type" "TransactionType" NOT NULL,
    "paymentMethod" "PaymentMethod",
    "amount" DECIMAL(35,8) NOT NULL,
    "fee" DECIMAL(35,8) DEFAULT 0,
    "feeInUsd" DECIMAL(35,8) DEFAULT 0,
    "amountFinal" DECIMAL(35,8),
    "toAmount" DECIMAL(35,8),
    "toUserId" TEXT,
    "toBankAccountId" TEXT,
    "toMantecaBankAccountId" TEXT,
    "toExternalId" TEXT,
    "externalType" TEXT,
    "currency" TEXT,
    "stripePaymentIntentId" TEXT,
    "finalCurrency" TEXT,
    "supportImageUrl" TEXT,
    "relatedTransactionId" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "providerTransactionId" TEXT,
    "internalFee" DECIMAL(35,8),
    "externalTransactionId" TEXT,
    "withdrawalSettlementId" TEXT,
    "eta" TIMESTAMP(3),
    "cryptoHash" TEXT,
    "cryptoAccountId" TEXT,
    "blockchainAddress" TEXT,
    "sourceBlockchainAddress" TEXT,
    "paypalTransactionId" TEXT,
    "paypalTransactionStatus" TEXT,
    "fireblocksVaultId" TEXT,
    "blockchain" TEXT,
    "fireblocksTransactionId" TEXT,
    "reversalFireblocksTransactionId" TEXT,
    "fireblocksSweepTransactionId" TEXT,
    "blockchainAddressMemo" TEXT,
    "fiatProvider" TEXT,
    "fiatReferenceNumber" TEXT,
    "fiatError" TEXT,
    "fiatRate" DECIMAL(35,8),
    "buyFiatRate" DECIMAL(35,8),
    "payrollPayeerId" TEXT,
    "koyweOrderId" TEXT,
    "pagoMovilPhoneNumber" TEXT,
    "meruDepositReference" TEXT,
    "isBinance" BOOLEAN,
    "sardineOrderId" TEXT,
    "usdBankAccountId" TEXT,
    "creditCardFingerprint" TEXT,
    "stripeRefundId" TEXT,
    "moneygramTransactionId" TEXT,
    "ipAddress" TEXT,
    "paypalSupportUrl" TEXT,
    "paypalService" TEXT,
    "paypalSignedAt" TIMESTAMP(3),
    "isRefund" BOOLEAN,
    "transactionEnvelope" TEXT,
    "usdVirtualBankAccountId" TEXT,
    "usdVirtualBankAccountSenderName" TEXT,
    "usdVirtualBankAccountPaymentRail" TEXT,
    "bridgeTransactionId" TEXT,
    "usdVirtualBankAccountTxDescription" TEXT,
    "pixKey" TEXT,
    "pixTransactionId" TEXT,
    "providerAmount" DECIMAL(65,30),
    "referenceBankReverse" TEXT,
    "cardId" TEXT,
    "cardProviderTransactionId" TEXT,
    "localAmount" DECIMAL(65,30),
    "localCurrency" TEXT,
    "liquidityTransactionId" TEXT,
    "paymentRail" TEXT,
    "cardProvider" "CardProvider" DEFAULT 'RAIN',
    "cardDeclineReason" TEXT,
    "boPagoFacilMeruReference" TEXT,
    "tesabizTransactionId" TEXT,
    "revenue" DECIMAL(35,8),
    "usdSentToPartner" DECIMAL(35,8),
    "ibanVirtualAccountId" TEXT,
    "incomingFireblocksTransactionId" TEXT,
    "controlFixedFeeUsd" DECIMAL(35,8),
    "controlVariableFeeUsd" DECIMAL(35,8),
    "controlFixedFeeLocal" DECIMAL(35,8),
    "controlVariableFeeLocal" DECIMAL(35,8),
    "controlProviderFixedFeeUsd" DECIMAL(35,8),
    "controlProviderVariableFeeUsd" DECIMAL(35,8),
    "controlProviderFixedFeeLocal" DECIMAL(35,8),
    "controlProviderVariableFeeLocal" DECIMAL(35,8),
    "controlMeruTotalRevenue" DECIMAL(35,8),
    "controlMeruGrossMargin" DECIMAL(35,8),
    "completedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "blindpayVirtualBankAccountId" TEXT,
    "fireblocksGasFeeTransactionId" TEXT,
    "arQrCodePaymentId" TEXT,
    "subStatus" "TransactionSubStatus",
    "complianceCheckingStatus" "ComplianceCheckingStatus",
    "complianceExecutedRules" JSONB[],
    "complianceHitRules" JSONB[],
    "screeningLevelResult" INTEGER,
    "temporalWorkflowId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashPayment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL,
    "commission" DECIMAL(35,8),
    "paycashId" TEXT,
    "userId" TEXT NOT NULL,
    "paymentNetwork" TEXT NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "paymentAgreementNumber" TEXT,
    "transactionId" TEXT,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "status" "CashPaymentStatus" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CashPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platfom" NOT NULL,
    "lastTimeAsked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolidfiPerson" (
    "id" TEXT NOT NULL,
    "solidfiId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "solidfiProgramId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SolidfiPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolidfiBankAccount" (
    "id" TEXT NOT NULL,
    "solidfiId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sponsorBankName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SolidfiBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolidfiCard" (
    "id" TEXT NOT NULL,
    "solidfiId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "cardHolderName" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "expiryMonth" TEXT NOT NULL,
    "expiryYear" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SolidfiCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardWaitingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "CardWaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USDBankAccountWaitingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "USDBankAccountWaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referralProgramId" TEXT NOT NULL,
    "blocked" BOOLEAN DEFAULT false,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralProgram" (
    "id" TEXT NOT NULL,
    "amountToReferrer" DECIMAL(35,8) NOT NULL,
    "amountToReferenced" DECIMAL(35,8) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "maxAmount" DECIMAL(35,8),
    "maxAmountPerAccount" DECIMAL(35,8) DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN DEFAULT true,
    "minAmount" DECIMAL(35,8) DEFAULT 10,
    "maxReferrals" DECIMAL(35,8) DEFAULT 20,
    "daysToComplete" INTEGER,
    "paymentMethods" "PaymentMethod"[],
    "textConditions" TEXT,
    "textDescription" TEXT,
    "shareText" TEXT,
    "shareTitle" TEXT,
    "country" TEXT,
    "transactionType" "TransactionType",
    "termsAndConditionsUrl" TEXT,

    CONSTRAINT "ReferralProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalDevice" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PhysicalDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "flagCode" TEXT NOT NULL,
    "isoCurrencyCode" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "assetCode" TEXT,
    "assetIssuerAddress" TEXT,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankCountry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "flagCode" TEXT NOT NULL,
    "isoCurrencyCode" TEXT NOT NULL,
    "currencyName" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BankCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayPalEmailAllowListed" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PayPalEmailAllowListed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" DECIMAL(35,8) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalSettlement" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "daysToSettlement" INTEGER NOT NULL,
    "settlementOnWeekendsAndHolidays" BOOLEAN NOT NULL DEFAULT false,
    "monCutOffTime" TEXT,
    "monStartTime" TEXT,
    "tueCutOffTime" TEXT,
    "tueStartTime" TEXT,
    "wedCutOffTime" TEXT,
    "wedStartTime" TEXT,
    "thuCutOffTime" TEXT,
    "thuStartTime" TEXT,
    "friCutOffTime" TEXT,
    "friStartTime" TEXT,
    "satCutOffTime" TEXT,
    "satStartTime" TEXT,
    "sunCutOffTime" TEXT,
    "sunStartTime" TEXT,
    "minutesToSettlement" INTEGER,

    CONSTRAINT "WithdrawalSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockchain" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CryptoAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYCCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "firstName" TEXT,
    "surname" TEXT,
    "documentNumber" TEXT,
    "dateOfBirth" TEXT,
    "expirationDate" TEXT,
    "documentType" TEXT,
    "issueCountry" TEXT,
    "nationality" TEXT,
    "sex" TEXT,
    "documentPhotoUrl" TEXT,
    "providerUrl" TEXT,
    "providerId" TEXT,
    "lastSuccessVerificationProviderId" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "mxCURP" TEXT,
    "clRunNumber" TEXT,
    "migrated" BOOLEAN,
    "personNumber" TEXT,
    "arCuit" TEXT,
    "usSSN" TEXT,
    "brCPF" TEXT,
    "taxIdentificationNumber" TEXT,

    CONSTRAINT "KYCCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FireblocksVault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fireblocksVaultId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "stellarDepositAddress" TEXT,
    "stellarDepositMemo" TEXT,

    CONSTRAINT "FireblocksVault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaybisFireblocksVault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fireblocksVaultId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "stellarDepositAddress" TEXT,
    "stellarDepositMemo" TEXT,

    CONSTRAINT "PaybisFireblocksVault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BinanceFireblocksVault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fireblocksVaultId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "stellarDepositAddress" TEXT,
    "stellarDepositMemo" TEXT,

    CONSTRAINT "BinanceFireblocksVault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USDBankAccountFireblocksVault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fireblocksVaultId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "USDBankAccountFireblocksVault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "countryScope" TEXT,
    "cognitoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "roleId" TEXT NOT NULL,
    "lastSignin" TIMESTAMP(3),

    CONSTRAINT "SystemUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreasuryTransaction" (
    "id" TEXT NOT NULL,
    "systemUserId" TEXT NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "TreasuryTransactionStatus" NOT NULL,
    "txHash" TEXT,

    CONSTRAINT "TreasuryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreasuryAddress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "source" "TreasuryAddressDestination" NOT NULL,
    "address" TEXT,
    "addressId" TEXT,
    "tag" TEXT,
    "blockchain" TEXT,
    "description" TEXT,
    "currency" TEXT DEFAULT 'USDC',

    CONSTRAINT "TreasuryAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedCryptoAddress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "blockchain" TEXT NOT NULL,

    CONSTRAINT "BannedCryptoAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "stellarAccountId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "PendingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingBalance" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL,
    "fromUserId" TEXT,
    "fromPayrollUserId" TEXT,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "pendingAccountId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" TIMESTAMP(3),
    "transactionType" "TransactionType",
    "payrollItemId" TEXT,
    "claimableAt" TIMESTAMP(3),
    "transactionId" TEXT,

    CONSTRAINT "PendingBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "totalAmount" DECIMAL(35,8) NOT NULL,
    "totalPayments" INTEGER NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "payrollUserId" TEXT,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollItem" (
    "id" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DECIMAL(35,8) NOT NULL,
    "email" TEXT NOT NULL,
    "status" "PayrollItemStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extraData" TEXT,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PayrollItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonCustodialStellarWallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "deviceKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "lastScreening" TIMESTAMP(3),
    "lastCursor" TEXT,

    CONSTRAINT "NonCustodialStellarWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustodialAccountsMigrated" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sweeped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CustodialAccountsMigrated_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fullAddress" TEXT,
    "streetName" TEXT NOT NULL,
    "streetNumber" TEXT,
    "housingDetails" TEXT NOT NULL,
    "neighborhood" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsdBankAccount" (
    "id" TEXT NOT NULL,
    "sardineId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT,
    "routingNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "type" TEXT,
    "sponsorBankName" TEXT,
    "sponsorBankAddress" TEXT,
    "status" "UsdBankAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UsdBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayId" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PayIdStatus" DEFAULT 'ACTIVE',
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PayId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLinkPaymentIntent" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "providerOrderId" TEXT,
    "provider" TEXT,
    "phoneNumber" TEXT,
    "amount" DECIMAL(35,8),
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentLinkPaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GetFrontConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'BINANCE',
    "prividerAccountId" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "getFrontId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GetFrontConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSignin" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "country" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "PayrollUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCustomer" (
    "id" TEXT NOT NULL,
    "payrollUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PayrollCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollStellarAccount" (
    "id" TEXT NOT NULL,
    "payrollUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "stellarDepositAddress" TEXT NOT NULL,
    "stellarDepositMemo" TEXT NOT NULL,
    "balance" DECIMAL(35,8) NOT NULL DEFAULT 0,

    CONSTRAINT "PayrollStellarAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOccupation" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "economicalActivity" TEXT NOT NULL,
    "economicalArea" TEXT NOT NULL,
    "sourceOfFunds" TEXT NOT NULL,
    "monthlyIncome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerOccupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountLimits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL DEFAULT 100,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "unlimited" BOOLEAN NOT NULL DEFAULT false,
    "period" "AccountLimitPeriod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountLimits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofOfResidency" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT,
    "fullName" TEXT,
    "resourceUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT,
    "emissionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "migrated" BOOLEAN,

    CONSTRAINT "ProofOfResidency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "cardReferenceId" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL DEFAULT 'VIRTUAL',
    "nameOnCard" TEXT NOT NULL,
    "cardholderId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "banTransferTransactionId" TEXT NOT NULL,
    "last4" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "CardStatus" DEFAULT 'ISSUED_INACTIVE',
    "hasBeenCharged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WisePaymentLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "url" TEXT,
    "transactionId" TEXT NOT NULL,
    "status" "WisePaymentLinkStatus" NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "referenceNumber" TEXT,

    CONSTRAINT "WisePaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "memo" TEXT,
    "blockchain" "Blockchain" NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "lastScreening" TIMESTAMP(3),

    CONSTRAINT "CryptoAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepositPaymentMethod" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "logoAssetPath" TEXT,
    "logoUrl" TEXT,
    "subtitle" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "isDynamic" BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "deepLink" TEXT,

    CONSTRAINT "DepositPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractMilestone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(35,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "directContractId" TEXT,

    CONSTRAINT "ContractMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectContract" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "hourlyRate" DECIMAL(35,8),
    "hoursPerWeek" INTEGER,
    "endDate" TIMESTAMP(3),
    "fixedPrice" DECIMAL(65,30),
    "notes" TEXT,
    "smartContractAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DirectContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsdBankAccountRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "UsdBankAccountRequestStatus",
    "error" TEXT,
    "tosSessionToken" TEXT,
    "signedAgreementId" TEXT,
    "signedAgreementAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "intendsOfUse" TEXT,
    "reprocessed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UsdBankAccountRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BridgeCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bridgeCustomerId" TEXT,
    "bridgeKycStatus" TEXT NOT NULL,
    "hasSepaEnabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BridgeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsdVirtualBankAccount" (
    "id" TEXT NOT NULL,
    "bridgeId" TEXT NOT NULL,
    "bridgeCustomerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sponsorBankName" TEXT NOT NULL,
    "sponsorBankAddress" TEXT NOT NULL,
    "depositMemo" TEXT,
    "destinationBlockchain" TEXT,
    "destinationAddress" TEXT,
    "destinationMemo" TEXT,
    "depositFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" TEXT DEFAULT 'activated',

    CONSTRAINT "UsdVirtualBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PixPayment" (
    "id" TEXT NOT NULL,
    "amountInReais" DECIMAL(65,30) NOT NULL,
    "sqalaId" TEXT NOT NULL,
    "sqalaCode" TEXT,
    "transactionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recipientName" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PixPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhoneNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ShipmentAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trakckingUrl" TEXT,
    "providerShipmentId" TEXT NOT NULL,
    "deliveryState" TEXT,
    "pickupState" TEXT,
    "shipmentAddressId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RainCardCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rainUserId" TEXT NOT NULL,
    "rainStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "adminAddress" TEXT,
    "extraVerificationLink" TEXT,

    CONSTRAINT "RainCardCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RainCard" (
    "id" TEXT NOT NULL,
    "rainCardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "expirationMonth" TEXT NOT NULL,
    "expirationYear" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "limitAmount" DECIMAL(65,30),
    "limitPeriod" TEXT,
    "rainUserId" TEXT,
    "rainCompanyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "hasPin" BOOLEAN DEFAULT false,
    "hasATMWithdrawalActive" BOOLEAN DEFAULT false,
    "pinUpdatedAt" TIMESTAMP(3),
    "bulkShippingGroupId" TEXT,

    CONSTRAINT "RainCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingCircle" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "circleName" TEXT,
    "circleStatus" TEXT,
    "maxUsers" INTEGER,
    "circleAmountPerUser" DECIMAL(65,30),
    "contractAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "finishAt" TIMESTAMP(3),

    CONSTRAINT "SavingCircle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnSavingCircles" (
    "userId" TEXT NOT NULL,
    "savingCircleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UsersOnSavingCircles_pkey" PRIMARY KEY ("userId","savingCircleId")
);

-- CreateTable
CREATE TABLE "CardDepositFireblocksVault" (
    "id" TEXT NOT NULL,
    "cardId" TEXT,
    "rainCardId" TEXT,
    "fireblocksVaultId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "stellarDepositAddress" TEXT,
    "stellarDepositMemo" TEXT,

    CONSTRAINT "CardDepositFireblocksVault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYCDocumentMedia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "bucketUrl" TEXT NOT NULL,
    "mediaType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "KYCDocumentMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyFlowSource" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceType" "MoneyFlowSourceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MoneyFlowSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyFlowDestination" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "destinationType" "MoneyFlowDestinationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "percentage" DECIMAL(65,30),
    "amount" DECIMAL(65,30),
    "moneyFlowId" TEXT,

    CONSTRAINT "MoneyFlowDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyFlow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),

    CONSTRAINT "MoneyFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyFlowExecution" (
    "id" TEXT NOT NULL,
    "moneyFlowId" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MoneyFlowExecutionStatus" NOT NULL DEFAULT 'CREATED',
    "triggerTransactionId" TEXT NOT NULL,

    CONSTRAINT "MoneyFlowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyFlowExecutionStep" (
    "id" TEXT NOT NULL,
    "moneyFlowExecutionId" TEXT NOT NULL,
    "moneyFlowDestinationId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "MoneyFlowExecutionStepStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "transactionId" TEXT,

    CONSTRAINT "MoneyFlowExecutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "iovationBlackbox" TEXT,
    "intendsOfUse" TEXT,
    "monthlyEstimatedAmount" TEXT,
    "errorLog" TEXT,

    CONSTRAINT "CardRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portalClientApiKey" TEXT,
    "portalClientId" TEXT,
    "eip155Address" TEXT,
    "solanaAddress" TEXT,
    "bitcoinAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PortalUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalUserBackupShare" (
    "backupMethod" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "cipherText" TEXT NOT NULL,
    "portalUserId" TEXT NOT NULL,

    CONSTRAINT "PortalUserBackupShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalCustodianBackupShare" (
    "backupMethod" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "share" TEXT NOT NULL,
    "portalUserId" TEXT NOT NULL,

    CONSTRAINT "PortalCustodianBackupShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeruTag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MeruTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralRegistration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ReferralRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidityTransaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "amount" DECIMAL(35,8) NOT NULL,
    "destAmount" DECIMAL(35,8),
    "fromToken" TEXT,
    "fromBlockchain" TEXT,
    "toToken" TEXT,
    "toBlockchain" TEXT,
    "txHash" TEXT,
    "fireblocksTransactionId" TEXT,
    "returnFireblocksTransactionId" TEXT,
    "returnTxHash" TEXT,
    "destinationFireblocksVaultId" TEXT,
    "destinationAddress" TEXT,
    "destinationMemo" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "LiquidityTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorAuth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twilioSid" TEXT NOT NULL,
    "twilioAccountSid" TEXT NOT NULL,
    "twilioEntitySId" TEXT NOT NULL,
    "twilioServiceSid" TEXT NOT NULL,
    "twilioStatus" TEXT NOT NULL,
    "friendlyName" TEXT NOT NULL,
    "factorType" TEXT NOT NULL DEFAULT 'topt',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "TwoFactorAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "deepLink" TEXT,
    "iconUrl" TEXT NOT NULL,
    "iconBackgroundColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "shareButtonText" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTransactionDispute" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardProvider" "CardProvider" NOT NULL,
    "cardId" TEXT NOT NULL,
    "disputeId" TEXT,
    "cardProviderTransactionId" TEXT,
    "disputeStatus" TEXT NOT NULL,
    "textEvidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "CardTransactionDispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoYapePayment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "transactionNumber" TEXT NOT NULL,
    "transactionAuthNumber" TEXT NOT NULL,
    "status" "BoYapePaymentStatus" NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BoYapePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoMovil" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryDocumentType" "VEDocumentType" NOT NULL,
    "beneficiaryDocumentNumber" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PagoMovil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoyweBankAccount" (
    "id" TEXT NOT NULL,
    "koyweBankAccountId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "KoyweBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MantecaUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mantecaUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "mantecaKycStatus" TEXT,

    CONSTRAINT "MantecaUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MantecaBankAccount" (
    "id" TEXT NOT NULL,
    "mantecaUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beneficiaryName" TEXT,
    "description" TEXT,
    "documentNumber" TEXT,
    "cbu" TEXT NOT NULL,
    "actualCbu" TEXT,
    "bankName" TEXT,
    "bankCode" TEXT,
    "accountType" TEXT,
    "mantecaBankAccountId" TEXT,
    "bankAccountId" TEXT,
    "status" "MantecaBankAccountSatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MantecaBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceRequirement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "requirement" TEXT NOT NULL,
    "process" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ComplianceRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IBANBankAccountWaitingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "IBANBankAccountWaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolfinCardWaitingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "SolfinCardWaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RainPhysicalCardWaitingList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "RainPhysicalCardWaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IbanVirtualAccount" (
    "id" TEXT NOT NULL,
    "bridgeId" TEXT NOT NULL,
    "bridgeCustomerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT NOT NULL,
    "sponsorBankName" TEXT NOT NULL,
    "sponsorBankAddress" TEXT NOT NULL,
    "depositMemo" TEXT,
    "destinationBlockchain" TEXT,
    "destinationAddress" TEXT,
    "destinationMemo" TEXT,
    "depositFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" TEXT DEFAULT 'activated',

    CONSTRAINT "IbanVirtualAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BridgeSOFQuestionary" (
    "id" TEXT NOT NULL,
    "bridgeCustomerId" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "expectedMonthlyPayments" TEXT NOT NULL,
    "actingAsIntermediary" BOOLEAN NOT NULL,
    "mostRecentOccupation" TEXT NOT NULL,
    "primaryPurpose" TEXT NOT NULL,
    "primaryPurposeOther" TEXT,
    "sourceOfFunds" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BridgeSOFQuestionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IbanAccountRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "IbanAccountRequestStatus",
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "IbanAccountRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PSEPayment" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "amount" DECIMAL(35,8) NOT NULL,
    "bankCode" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionStatus" TEXT,
    "status" TEXT NOT NULL,
    "cus" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PSEPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoyweAccount" (
    "id" TEXT NOT NULL,
    "koyweEmail" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "KoyweAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlindpayUSBankAccountRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "BlindpayUsBankAccountRequestStatus",
    "tosSessionToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BlindpayUSBankAccountRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlindpayCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blindpayCustomerId" TEXT,
    "blindpayKycStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BlindpayCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlindpayWallet" (
    "id" TEXT NOT NULL,
    "blindpayCustomerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blindpayWalletId" TEXT,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BlindpayWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlindpayVirtualBankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blindpayVBAId" TEXT,
    "token" TEXT NOT NULL,
    "blockchainWalletId" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "usACHRoutingNumber" TEXT,
    "usACHAccountNumber" TEXT,
    "usWireRoutingNumber" TEXT,
    "usWireAccountNumber" TEXT,
    "usRTPRoutingNumber" TEXT,
    "usRTPAccountNumber" TEXT,
    "swiftBicCode" TEXT,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryAddressLine1" TEXT NOT NULL,
    "beneficiaryAddressLine2" TEXT,
    "receivingBankName" TEXT NOT NULL,
    "receivingBankAddressLine1" TEXT NOT NULL,
    "receivingBankAddressLine2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BlindpayVirtualBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalCardRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "PhysicalCardRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shippedAt" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "shippingId" TEXT,
    "courierId" TEXT,
    "errorMessage" TEXT,
    "cardId" TEXT,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "PhysicalCardRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "ShippingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasyshipOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardRequestId" TEXT NOT NULL,
    "easyshipOrderId" TEXT NOT NULL,
    "shippingPrice" DECIMAL(35,8),
    "minDeliveryTime" INTEGER,
    "maxDeliveryTime" INTEGER,
    "labelUrl" TEXT,
    "trackingUrl" TEXT,
    "courierId" TEXT,
    "courierName" TEXT,
    "easyshipBatchId" TEXT,
    "status" TEXT NOT NULL,
    "labelStatus" TEXT,
    "errors" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EasyshipOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasyShipBatch" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EasyShipBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArQrCodePayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "beneficiaryLegalId" TEXT,
    "beneficiaryName" TEXT,
    "qrCode" TEXT NOT NULL,
    "amountInArs" DECIMAL(35,8) NOT NULL,
    "lockCodeId" TEXT NOT NULL,
    "status" "ArQrCodePaymentStatus" NOT NULL,
    "syntheticId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "ArQrCodePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkShippingGroup" (
    "id" TEXT NOT NULL,
    "rainBulkShippingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "bulkShippingAddressId" TEXT,

    CONSTRAINT "BulkShippingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkShippingAddressInfo" (
    "id" TEXT NOT NULL,
    "recipientFirstName" TEXT NOT NULL,
    "recipientLastName" TEXT NOT NULL,
    "recipientPhoneCountryCode" TEXT NOT NULL,
    "recipientPhoneNumber" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "BulkShippingAddressInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cognitoId_key" ON "User"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stellarAccountId_key" ON "User"("stellarAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_portalUserId_key" ON "User"("portalUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_guenoUserId_key" ON "User"("guenoUserId");

-- CreateIndex
CREATE UNIQUE INDEX "StellarAccount_publicKey_key" ON "StellarAccount"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "StellarAccount_secretKey_key" ON "StellarAccount"("secretKey");

-- CreateIndex
CREATE UNIQUE INDEX "StellarAccount_userId_key" ON "StellarAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_documentType_documentNumber_key" ON "Customer"("documentType", "documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionSupport_stellarTransactionId_key" ON "TransactionSupport"("stellarTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Rate_name_key" ON "Rate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_shareUrl_key" ON "PaymentLink"("shareUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentLinkId_key" ON "Invoice"("paymentLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_userId_key" ON "Device"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_fcmToken_key" ON "Device"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stellarTransactionId_key" ON "Transaction"("stellarTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionEnvelope_key" ON "Transaction"("transactionEnvelope");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_cardProviderTransactionId_key" ON "Transaction"("cardProviderTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_liquidityTransactionId_key" ON "Transaction"("liquidityTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_tesabizTransactionId_key" ON "Transaction"("tesabizTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_fireblocksGasFeeTransactionId_key" ON "Transaction"("fireblocksGasFeeTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_arQrCodePaymentId_key" ON "Transaction"("arQrCodePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_temporalWorkflowId_key" ON "Transaction"("temporalWorkflowId");

-- CreateIndex
CREATE UNIQUE INDEX "CashPayment_paymentReference_key" ON "CashPayment"("paymentReference");

-- CreateIndex
CREATE UNIQUE INDEX "CashPayment_transactionId_key" ON "CashPayment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "SolidfiPerson_userId_key" ON "SolidfiPerson"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CardWaitingList_userId_key" ON "CardWaitingList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "USDBankAccountWaitingList_userId_key" ON "USDBankAccountWaitingList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_fingerprint_key" ON "CreditCard"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_code_key" ON "Referral"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_userId_referralProgramId_key" ON "Referral"("userId", "referralProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalDevice_deviceId_key" ON "PhysicalDevice"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalDevice_userId_key" ON "PhysicalDevice"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_id_key" ON "Country"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BankCountry_id_key" ON "BankCountry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BankCountry_name_key" ON "BankCountry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_transactionId_key" ON "Exchange"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalSettlement_country_key" ON "WithdrawalSettlement"("country");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAccount_address_key" ON "CryptoAccount"("address");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAccount_privateKey_key" ON "CryptoAccount"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAccount_userId_blockchain_key" ON "CryptoAccount"("userId", "blockchain");

-- CreateIndex
CREATE UNIQUE INDEX "KYCCustomer_userId_key" ON "KYCCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KYCCustomer_providerId_key" ON "KYCCustomer"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "KYCCustomer_lastSuccessVerificationProviderId_key" ON "KYCCustomer"("lastSuccessVerificationProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "FireblocksVault_userId_key" ON "FireblocksVault"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FireblocksVault_fireblocksVaultId_key" ON "FireblocksVault"("fireblocksVaultId");

-- CreateIndex
CREATE UNIQUE INDEX "PaybisFireblocksVault_userId_key" ON "PaybisFireblocksVault"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaybisFireblocksVault_fireblocksVaultId_key" ON "PaybisFireblocksVault"("fireblocksVaultId");

-- CreateIndex
CREATE UNIQUE INDEX "BinanceFireblocksVault_userId_key" ON "BinanceFireblocksVault"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BinanceFireblocksVault_fireblocksVaultId_key" ON "BinanceFireblocksVault"("fireblocksVaultId");

-- CreateIndex
CREATE UNIQUE INDEX "USDBankAccountFireblocksVault_userId_key" ON "USDBankAccountFireblocksVault"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "USDBankAccountFireblocksVault_fireblocksVaultId_key" ON "USDBankAccountFireblocksVault"("fireblocksVaultId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemUser_email_key" ON "SystemUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SystemUser_cognitoId_key" ON "SystemUser"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingAccount_email_key" ON "PendingAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingAccount_phone_key" ON "PendingAccount"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PendingAccount_stellarAccountId_key" ON "PendingAccount"("stellarAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingAccount_userId_key" ON "PendingAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NonCustodialStellarWallet_publicKey_key" ON "NonCustodialStellarWallet"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "NonCustodialStellarWallet_deviceKey_key" ON "NonCustodialStellarWallet"("deviceKey");

-- CreateIndex
CREATE UNIQUE INDEX "NonCustodialStellarWallet_userId_key" ON "NonCustodialStellarWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustodialAccountsMigrated_publicKey_key" ON "CustodialAccountsMigrated"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "CustodialAccountsMigrated_userId_key" ON "CustodialAccountsMigrated"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pin_userId_key" ON "Pin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_customerId_key" ON "Address"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "UsdBankAccount_userId_key" ON "UsdBankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PayId_userId_key" ON "PayId"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PayId_payId_key" ON "PayId"("payId");

-- CreateIndex
CREATE UNIQUE INDEX "GetFrontConnection_userId_key" ON "GetFrontConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GetFrontConnection_getFrontId_key" ON "GetFrontConnection"("getFrontId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollUser_email_key" ON "PayrollUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollUser_cognitoId_key" ON "PayrollUser"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollCustomer_payrollUserId_key" ON "PayrollCustomer"("payrollUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollStellarAccount_payrollUserId_key" ON "PayrollStellarAccount"("payrollUserId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOccupation_customerId_key" ON "CustomerOccupation"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProofOfResidency_userId_key" ON "ProofOfResidency"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardReferenceId_key" ON "Card"("cardReferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardholderId_key" ON "Card"("cardholderId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_banTransferTransactionId_key" ON "Card"("banTransferTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractMilestone_name_key" ON "ContractMilestone"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DirectContract_name_key" ON "DirectContract"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UsdBankAccountRequest_userId_key" ON "UsdBankAccountRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BridgeCustomer_userId_key" ON "BridgeCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BridgeCustomer_bridgeCustomerId_key" ON "BridgeCustomer"("bridgeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "UsdVirtualBankAccount_userId_key" ON "UsdVirtualBankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PixPayment_sqalaId_key" ON "PixPayment"("sqalaId");

-- CreateIndex
CREATE UNIQUE INDEX "PixPayment_sqalaCode_key" ON "PixPayment"("sqalaCode");

-- CreateIndex
CREATE UNIQUE INDEX "PixPayment_transactionId_key" ON "PixPayment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipmentAddressId_key" ON "Shipment"("shipmentAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "RainCardCustomer_userId_key" ON "RainCardCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RainCard_rainCardId_key" ON "RainCard"("rainCardId");

-- CreateIndex
CREATE UNIQUE INDEX "SavingCircle_ownerId_key" ON "SavingCircle"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "CardDepositFireblocksVault_cardId_key" ON "CardDepositFireblocksVault"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardDepositFireblocksVault_rainCardId_key" ON "CardDepositFireblocksVault"("rainCardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardDepositFireblocksVault_fireblocksVaultId_key" ON "CardDepositFireblocksVault"("fireblocksVaultId");

-- CreateIndex
CREATE UNIQUE INDEX "KYCDocumentMedia_bucketUrl_key" ON "KYCDocumentMedia"("bucketUrl");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyFlow_sourceId_key" ON "MoneyFlow"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyFlowExecution_triggerTransactionId_key" ON "MoneyFlowExecution"("triggerTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "MoneyFlowExecutionStep_transactionId_key" ON "MoneyFlowExecutionStep"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PortalUser_userId_key" ON "PortalUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PortalUser_portalClientApiKey_key" ON "PortalUser"("portalClientApiKey");

-- CreateIndex
CREATE UNIQUE INDEX "PortalUser_portalClientId_key" ON "PortalUser"("portalClientId");

-- CreateIndex
CREATE UNIQUE INDEX "PortalUserBackupShare_portalUserId_backupMethod_key" ON "PortalUserBackupShare"("portalUserId", "backupMethod");

-- CreateIndex
CREATE UNIQUE INDEX "PortalCustodianBackupShare_portalUserId_backupMethod_key" ON "PortalCustodianBackupShare"("portalUserId", "backupMethod");

-- CreateIndex
CREATE UNIQUE INDEX "MeruTag_tag_key" ON "MeruTag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "MeruTag_userId_key" ON "MeruTag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRegistration_email_key" ON "ReferralRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidityTransaction_transactionId_key" ON "LiquidityTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidityTransaction_fireblocksTransactionId_key" ON "LiquidityTransaction"("fireblocksTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidityTransaction_returnFireblocksTransactionId_key" ON "LiquidityTransaction"("returnFireblocksTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorAuth_userId_key" ON "TwoFactorAuth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Share_articleId_key" ON "Share"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "CardTransactionDispute_transactionId_key" ON "CardTransactionDispute"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "CardTransactionDispute_disputeId_key" ON "CardTransactionDispute"("disputeId");

-- CreateIndex
CREATE UNIQUE INDEX "BoYapePayment_transactionId_key" ON "BoYapePayment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "KoyweBankAccount_koyweBankAccountId_key" ON "KoyweBankAccount"("koyweBankAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "KoyweBankAccount_bankAccountId_key" ON "KoyweBankAccount"("bankAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "MantecaUser_userId_key" ON "MantecaUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MantecaUser_mantecaUserId_key" ON "MantecaUser"("mantecaUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MantecaBankAccount_mantecaBankAccountId_key" ON "MantecaBankAccount"("mantecaBankAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "MantecaBankAccount_bankAccountId_key" ON "MantecaBankAccount"("bankAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "IBANBankAccountWaitingList_userId_key" ON "IBANBankAccountWaitingList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SolfinCardWaitingList_userId_key" ON "SolfinCardWaitingList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RainPhysicalCardWaitingList_userId_key" ON "RainPhysicalCardWaitingList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IbanVirtualAccount_userId_key" ON "IbanVirtualAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BridgeSOFQuestionary_bridgeCustomerId_key" ON "BridgeSOFQuestionary"("bridgeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "IbanAccountRequest_userId_key" ON "IbanAccountRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PSEPayment_providerId_key" ON "PSEPayment"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "PSEPayment_transactionId_key" ON "PSEPayment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PSEPayment_cus_key" ON "PSEPayment"("cus");

-- CreateIndex
CREATE UNIQUE INDEX "KoyweAccount_koyweEmail_key" ON "KoyweAccount"("koyweEmail");

-- CreateIndex
CREATE UNIQUE INDEX "KoyweAccount_userId_key" ON "KoyweAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlindpayUSBankAccountRequest_userId_key" ON "BlindpayUSBankAccountRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlindpayCustomer_userId_key" ON "BlindpayCustomer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlindpayCustomer_blindpayCustomerId_key" ON "BlindpayCustomer"("blindpayCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "BlindpayWallet_blindpayWalletId_key" ON "BlindpayWallet"("blindpayWalletId");

-- CreateIndex
CREATE UNIQUE INDEX "BlindpayVirtualBankAccount_blindpayVBAId_key" ON "BlindpayVirtualBankAccount"("blindpayVBAId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalCardRequest_cardId_key" ON "PhysicalCardRequest"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "EasyshipOrder_cardRequestId_key" ON "EasyshipOrder"("cardRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "EasyShipBatch_batchId_key" ON "EasyShipBatch"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "ArQrCodePayment_transactionId_key" ON "ArQrCodePayment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ArQrCodePayment_lockCodeId_key" ON "ArQrCodePayment"("lockCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "ArQrCodePayment_syntheticId_key" ON "ArQrCodePayment"("syntheticId");

-- CreateIndex
CREATE UNIQUE INDEX "BulkShippingGroup_rainBulkShippingId_key" ON "BulkShippingGroup"("rainBulkShippingId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StellarAccount" ADD CONSTRAINT "StellarAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentLinkId_fkey" FOREIGN KEY ("paymentLinkId") REFERENCES "PaymentLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toBankAccountId_fkey" FOREIGN KEY ("toBankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toMantecaBankAccountId_fkey" FOREIGN KEY ("toMantecaBankAccountId") REFERENCES "MantecaBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_withdrawalSettlementId_fkey" FOREIGN KEY ("withdrawalSettlementId") REFERENCES "WithdrawalSettlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cryptoAccountId_fkey" FOREIGN KEY ("cryptoAccountId") REFERENCES "CryptoAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_usdBankAccountId_fkey" FOREIGN KEY ("usdBankAccountId") REFERENCES "UsdBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_usdVirtualBankAccountId_fkey" FOREIGN KEY ("usdVirtualBankAccountId") REFERENCES "UsdVirtualBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ibanVirtualAccountId_fkey" FOREIGN KEY ("ibanVirtualAccountId") REFERENCES "IbanVirtualAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_blindpayVirtualBankAccountId_fkey" FOREIGN KEY ("blindpayVirtualBankAccountId") REFERENCES "BlindpayVirtualBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashPayment" ADD CONSTRAINT "CashPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashPayment" ADD CONSTRAINT "CashPayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolidfiPerson" ADD CONSTRAINT "SolidfiPerson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USDBankAccountWaitingList" ADD CONSTRAINT "USDBankAccountWaitingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referralProgramId_fkey" FOREIGN KEY ("referralProgramId") REFERENCES "ReferralProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalDevice" ADD CONSTRAINT "PhysicalDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayPalEmailAllowListed" ADD CONSTRAINT "PayPalEmailAllowListed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoAccount" ADD CONSTRAINT "CryptoAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYCCustomer" ADD CONSTRAINT "KYCCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FireblocksVault" ADD CONSTRAINT "FireblocksVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaybisFireblocksVault" ADD CONSTRAINT "PaybisFireblocksVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BinanceFireblocksVault" ADD CONSTRAINT "BinanceFireblocksVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USDBankAccountFireblocksVault" ADD CONSTRAINT "USDBankAccountFireblocksVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemUser" ADD CONSTRAINT "SystemUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreasuryTransaction" ADD CONSTRAINT "TreasuryTransaction_systemUserId_fkey" FOREIGN KEY ("systemUserId") REFERENCES "SystemUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreasuryTransaction" ADD CONSTRAINT "TreasuryTransaction_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TreasuryAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreasuryTransaction" ADD CONSTRAINT "TreasuryTransaction_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "TreasuryAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreasuryAddress" ADD CONSTRAINT "TreasuryAddress_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "SystemUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingAccount" ADD CONSTRAINT "PendingAccount_stellarAccountId_fkey" FOREIGN KEY ("stellarAccountId") REFERENCES "StellarAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingAccount" ADD CONSTRAINT "PendingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBalance" ADD CONSTRAINT "PendingBalance_pendingAccountId_fkey" FOREIGN KEY ("pendingAccountId") REFERENCES "PendingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBalance" ADD CONSTRAINT "PendingBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBalance" ADD CONSTRAINT "PendingBalance_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_payrollUserId_fkey" FOREIGN KEY ("payrollUserId") REFERENCES "PayrollUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollItem" ADD CONSTRAINT "PayrollItem_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollItem" ADD CONSTRAINT "PayrollItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonCustodialStellarWallet" ADD CONSTRAINT "NonCustodialStellarWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsdBankAccount" ADD CONSTRAINT "UsdBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayId" ADD CONSTRAINT "PayId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentLinkPaymentIntent" ADD CONSTRAINT "PaymentLinkPaymentIntent_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GetFrontConnection" ADD CONSTRAINT "GetFrontConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCustomer" ADD CONSTRAINT "PayrollCustomer_payrollUserId_fkey" FOREIGN KEY ("payrollUserId") REFERENCES "PayrollUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollStellarAccount" ADD CONSTRAINT "PayrollStellarAccount_payrollUserId_fkey" FOREIGN KEY ("payrollUserId") REFERENCES "PayrollUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOccupation" ADD CONSTRAINT "CustomerOccupation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountLimits" ADD CONSTRAINT "AccountLimits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofOfResidency" ADD CONSTRAINT "ProofOfResidency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WisePaymentLink" ADD CONSTRAINT "WisePaymentLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WisePaymentLink" ADD CONSTRAINT "WisePaymentLink_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoAddress" ADD CONSTRAINT "CryptoAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractMilestone" ADD CONSTRAINT "ContractMilestone_directContractId_fkey" FOREIGN KEY ("directContractId") REFERENCES "DirectContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectContract" ADD CONSTRAINT "DirectContract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsdBankAccountRequest" ADD CONSTRAINT "UsdBankAccountRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BridgeCustomer" ADD CONSTRAINT "BridgeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsdVirtualBankAccount" ADD CONSTRAINT "UsdVirtualBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PixPayment" ADD CONSTRAINT "PixPayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PixPayment" ADD CONSTRAINT "PixPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentAddress" ADD CONSTRAINT "ShipmentAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_shipmentAddressId_fkey" FOREIGN KEY ("shipmentAddressId") REFERENCES "ShipmentAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RainCardCustomer" ADD CONSTRAINT "RainCardCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RainCard" ADD CONSTRAINT "RainCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RainCard" ADD CONSTRAINT "RainCard_bulkShippingGroupId_fkey" FOREIGN KEY ("bulkShippingGroupId") REFERENCES "BulkShippingGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingCircle" ADD CONSTRAINT "SavingCircle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnSavingCircles" ADD CONSTRAINT "UsersOnSavingCircles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnSavingCircles" ADD CONSTRAINT "UsersOnSavingCircles_savingCircleId_fkey" FOREIGN KEY ("savingCircleId") REFERENCES "SavingCircle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDepositFireblocksVault" ADD CONSTRAINT "CardDepositFireblocksVault_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDepositFireblocksVault" ADD CONSTRAINT "CardDepositFireblocksVault_rainCardId_fkey" FOREIGN KEY ("rainCardId") REFERENCES "RainCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYCDocumentMedia" ADD CONSTRAINT "KYCDocumentMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyFlowDestination" ADD CONSTRAINT "MoneyFlowDestination_moneyFlowId_fkey" FOREIGN KEY ("moneyFlowId") REFERENCES "MoneyFlow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyFlow" ADD CONSTRAINT "MoneyFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyFlow" ADD CONSTRAINT "MoneyFlow_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "MoneyFlowSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyFlowExecution" ADD CONSTRAINT "MoneyFlowExecution_moneyFlowId_fkey" FOREIGN KEY ("moneyFlowId") REFERENCES "MoneyFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyFlowExecutionStep" ADD CONSTRAINT "MoneyFlowExecutionStep_moneyFlowExecutionId_fkey" FOREIGN KEY ("moneyFlowExecutionId") REFERENCES "MoneyFlowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyFlowExecutionStep" ADD CONSTRAINT "MoneyFlowExecutionStep_moneyFlowDestinationId_fkey" FOREIGN KEY ("moneyFlowDestinationId") REFERENCES "MoneyFlowDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardRequest" ADD CONSTRAINT "CardRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalUser" ADD CONSTRAINT "PortalUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalUserBackupShare" ADD CONSTRAINT "PortalUserBackupShare_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalCustodianBackupShare" ADD CONSTRAINT "PortalCustodianBackupShare_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeruTag" ADD CONSTRAINT "MeruTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralRegistration" ADD CONSTRAINT "ReferralRegistration_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorAuth" ADD CONSTRAINT "TwoFactorAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransactionDispute" ADD CONSTRAINT "CardTransactionDispute_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTransactionDispute" ADD CONSTRAINT "CardTransactionDispute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoYapePayment" ADD CONSTRAINT "BoYapePayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoMovil" ADD CONSTRAINT "PagoMovil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoyweBankAccount" ADD CONSTRAINT "KoyweBankAccount_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MantecaUser" ADD CONSTRAINT "MantecaUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MantecaBankAccount" ADD CONSTRAINT "MantecaBankAccount_mantecaUserId_fkey" FOREIGN KEY ("mantecaUserId") REFERENCES "MantecaUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MantecaBankAccount" ADD CONSTRAINT "MantecaBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MantecaBankAccount" ADD CONSTRAINT "MantecaBankAccount_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRequirement" ADD CONSTRAINT "ComplianceRequirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IBANBankAccountWaitingList" ADD CONSTRAINT "IBANBankAccountWaitingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IbanVirtualAccount" ADD CONSTRAINT "IbanVirtualAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BridgeSOFQuestionary" ADD CONSTRAINT "BridgeSOFQuestionary_bridgeCustomerId_fkey" FOREIGN KEY ("bridgeCustomerId") REFERENCES "BridgeCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IbanAccountRequest" ADD CONSTRAINT "IbanAccountRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PSEPayment" ADD CONSTRAINT "PSEPayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PSEPayment" ADD CONSTRAINT "PSEPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoyweAccount" ADD CONSTRAINT "KoyweAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlindpayUSBankAccountRequest" ADD CONSTRAINT "BlindpayUSBankAccountRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlindpayCustomer" ADD CONSTRAINT "BlindpayCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlindpayWallet" ADD CONSTRAINT "BlindpayWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlindpayVirtualBankAccount" ADD CONSTRAINT "BlindpayVirtualBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalCardRequest" ADD CONSTRAINT "PhysicalCardRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalCardRequest" ADD CONSTRAINT "PhysicalCardRequest_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "ShippingInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalCardRequest" ADD CONSTRAINT "PhysicalCardRequest_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "RainCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingInfo" ADD CONSTRAINT "ShippingInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasyshipOrder" ADD CONSTRAINT "EasyshipOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasyshipOrder" ADD CONSTRAINT "EasyshipOrder_cardRequestId_fkey" FOREIGN KEY ("cardRequestId") REFERENCES "PhysicalCardRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasyshipOrder" ADD CONSTRAINT "EasyshipOrder_easyshipBatchId_fkey" FOREIGN KEY ("easyshipBatchId") REFERENCES "EasyShipBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArQrCodePayment" ADD CONSTRAINT "ArQrCodePayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArQrCodePayment" ADD CONSTRAINT "ArQrCodePayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkShippingGroup" ADD CONSTRAINT "BulkShippingGroup_bulkShippingAddressId_fkey" FOREIGN KEY ("bulkShippingAddressId") REFERENCES "BulkShippingAddressInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
