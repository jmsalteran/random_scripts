import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { 
    PrismaClient, 
    TransactionType,
    PaymentMethod,
    TransactionStatus
} from '@prisma/client';
import { InfoGenerator } from "../info-generator";

import { BUSINESS_CONSTANTS } from "./shared/constants";
import { getRandomEnumValue } from "./shared/utils";

export class TransactionsSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveTransactions(users: any[]) {
        try {
            console.log(`Generating transactions for ${users.length} users...`);
            
            // Generate transaction data for each user
            const transactions = [];
            const now = new Date().toISOString();
            
            for (const user of users) {
                // Generate 2-10 transactions per user (random)
                const numTransactions = Math.floor(Math.random() * 9) + 2; // 2 to 10 transactions
                
                for (let j = 0; j < numTransactions; j++) {
                    const transactionType = getRandomEnumValue(TransactionType);
                    const paymentMethod = Math.random() > 0.3 ? getRandomEnumValue(PaymentMethod) : null; // 70% chance of having payment method
                    const status = getRandomEnumValue(TransactionStatus);
                    const currency = BUSINESS_CONSTANTS.currencies[Math.floor(Math.random() * BUSINESS_CONSTANTS.currencies.length)];
                    
                    // Generate random amount between 10 and 10000
                    const amount = Math.random() * 9990 + 10;
                    const fee = Math.random() > 0.7 ? Math.random() * 50 : 0; // 30% chance of having fee
                    const feeInUsd = fee > 0 ? fee * (Math.random() * 0.5 + 0.5) : 0; // Convert fee to USD with random rate
                    
                    // Generate transaction data
                    const transaction = {
                        id: uuidv4(),
                        userId: user.id,
                        stellarTransactionId: Math.random() > 0.6 ? InfoGenerator.key() : null, // 40% chance of having stellar transaction ID
                        type: transactionType,
                        paymentMethod: paymentMethod,
                        amount: amount,
                        fee: fee,
                        feeInUsd: feeInUsd,
                        amountFinal: amount - fee,
                        toAmount: Math.random() > 0.5 ? amount * (Math.random() * 0.2 + 0.9) : null, // 50% chance of having toAmount
                        toUserId: Math.random() > 0.8 ? users[Math.floor(Math.random() * users.length)].id : null, // 20% chance of having toUserId
                        toBankAccountId: null, // Will be set if needed
                        toMantecaBankAccountId: null, // Will be set if needed
                        toExternalId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having external ID
                        externalType: Math.random() > 0.9 ? ['PAYPAL', 'STRIPE', 'BANK_TRANSFER'][Math.floor(Math.random() * 3)] : null, // 10% chance
                        currency: currency,
                        stripePaymentIntentId: Math.random() > 0.9 ? `pi_${InfoGenerator.key().substring(0, 24)}` : null, // 10% chance of having Stripe payment intent
                        finalCurrency: Math.random() > 0.7 ? currency : null, // 30% chance of having final currency
                        supportImageUrl: Math.random() > 0.95 ? faker.image.url() : null, // 5% chance of having support image
                        relatedTransactionId: Math.random() > 0.9 ? uuidv4() : null, // 10% chance of having related transaction
                        status: status,
                        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
                        updatedAt: new Date(now),
                        providerTransactionId: Math.random() > 0.7 ? InfoGenerator.key().substring(0, 20) : null, // 30% chance of having provider transaction ID
                        internalFee: Math.random() > 0.8 ? Math.random() * 10 : null, // 20% chance of having internal fee
                        externalTransactionId: Math.random() > 0.8 ? InfoGenerator.key().substring(0, 20) : null, // 20% chance of having external transaction ID
                        eta: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null, // 30% chance of having ETA
                        cryptoHash: Math.random() > 0.8 ? `0x${InfoGenerator.key().substring(0, 64)}` : null, // 20% chance of having crypto hash
                        cryptoAccountId: null, // Will be set if needed
                        blockchainAddress: Math.random() > 0.8 ? `0x${InfoGenerator.key().substring(0, 40)}` : null, // 20% chance of having blockchain address
                        sourceBlockchainAddress: Math.random() > 0.9 ? `0x${InfoGenerator.key().substring(0, 40)}` : null, // 10% chance of having source blockchain address
                        paypalTransactionId: Math.random() > 0.9 ? `PAY-${InfoGenerator.key().substring(0, 16)}` : null, // 10% chance of having PayPal transaction ID
                        paypalTransactionStatus: Math.random() > 0.9 ? ['COMPLETED', 'PENDING', 'FAILED'][Math.floor(Math.random() * 3)] : null, // 10% chance
                        fireblocksVaultId: Math.random() > 0.9 ? uuidv4() : null, // 10% chance of having Fireblocks vault ID
                        blockchain: Math.random() > 0.8 ? ['ETH', 'BTC', 'XLM', 'USDC'][Math.floor(Math.random() * 4)] : null, // 20% chance of having blockchain
                        fireblocksTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having Fireblocks transaction ID
                        reversalFireblocksTransactionId: Math.random() > 0.95 ? InfoGenerator.key().substring(0, 20) : null, // 5% chance of having reversal transaction ID
                        fireblocksSweepTransactionId: Math.random() > 0.95 ? InfoGenerator.key().substring(0, 20) : null, // 5% chance of having sweep transaction ID
                        blockchainAddressMemo: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having memo
                        fiatProvider: Math.random() > 0.8 ? ['BANXA', 'MOONPAY', 'RAMP'][Math.floor(Math.random() * 3)] : null, // 20% chance of having fiat provider
                        fiatReferenceNumber: Math.random() > 0.8 ? InfoGenerator.key().substring(0, 20) : null, // 20% chance of having fiat reference number
                        fiatError: Math.random() > 0.95 ? faker.lorem.sentence() : null, // 5% chance of having fiat error
                        fiatRate: Math.random() > 0.7 ? Math.random() * 2 + 0.5 : null, // 30% chance of having fiat rate
                        buyFiatRate: Math.random() > 0.7 ? Math.random() * 2 + 0.5 : null, // 30% chance of having buy fiat rate
                        payrollPayeerId: Math.random() > 0.9 ? uuidv4() : null, // 10% chance of having payroll payeer ID
                        koyweOrderId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having Koywe order ID
                        pagoMovilPhoneNumber: Math.random() > 0.9 ? `+58${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null, // 10% chance of having PagoMovil phone
                        meruDepositReference: Math.random() > 0.8 ? `MERU-${InfoGenerator.key().substring(0, 16)}` : null, // 20% chance of having Meru deposit reference
                        isBinance: Math.random() > 0.9, // 10% chance of being Binance transaction
                        sardineOrderId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having Sardine order ID
                        usdBankAccountId: null, // Will be set if needed
                        creditCardFingerprint: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 32) : null, // 10% chance of having credit card fingerprint
                        stripeRefundId: Math.random() > 0.95 ? `re_${InfoGenerator.key().substring(0, 24)}` : null, // 5% chance of having Stripe refund ID
                        moneygramTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having MoneyGram transaction ID
                        ipAddress: Math.random() > 0.7 ? faker.internet.ip() : null, // 30% chance of having IP address
                        paypalSupportUrl: Math.random() > 0.95 ? faker.internet.url() : null, // 5% chance of having PayPal support URL
                        paypalService: Math.random() > 0.9 ? ['PAYMENT', 'REFUND', 'CHARGEBACK'][Math.floor(Math.random() * 3)] : null, // 10% chance of having PayPal service
                        paypalSignedAt: Math.random() > 0.9 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null, // 10% chance of having PayPal signed at
                        isRefund: Math.random() > 0.9, // 10% chance of being refund
                        transactionEnvelope: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 100) : null, // 10% chance of having transaction envelope
                        usdVirtualBankAccountId: null, // Will be set if needed
                        usdVirtualBankAccountSenderName: Math.random() > 0.9 ? `${InfoGenerator.generateFirstName()} ${InfoGenerator.generateLastName()}` : null, // 10% chance of having sender name
                        usdVirtualBankAccountPaymentRail: Math.random() > 0.9 ? ['ACH', 'WIRE', 'ZELLE'][Math.floor(Math.random() * 3)] : null, // 10% chance of having payment rail
                        bridgeTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having Bridge transaction ID
                        usdVirtualBankAccountTxDescription: Math.random() > 0.9 ? faker.lorem.sentence() : null, // 10% chance of having transaction description
                        pixKey: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having PIX key
                        pixTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having PIX transaction ID
                        providerAmount: Math.random() > 0.7 ? amount * (Math.random() * 0.2 + 0.9) : null, // 30% chance of having provider amount
                        referenceBankReverse: Math.random() > 0.95 ? InfoGenerator.key().substring(0, 20) : null, // 5% chance of having bank reverse reference
                        cardId: null, // Will be set if needed
                        cardProviderTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having card provider transaction ID
                        localAmount: Math.random() > 0.7 ? amount * (Math.random() * 2 + 0.5) : null, // 30% chance of having local amount
                        localCurrency: Math.random() > 0.7 ? BUSINESS_CONSTANTS.currencies[Math.floor(Math.random() * BUSINESS_CONSTANTS.currencies.length)] : null, // 30% chance of having local currency
                        liquidityTransactionId: Math.random() > 0.9 ? uuidv4() : null, // 10% chance of having liquidity transaction ID
                        paymentRail: Math.random() > 0.8 ? ['ACH', 'WIRE', 'ZELLE', 'SEPA'][Math.floor(Math.random() * 4)] : null, // 20% chance of having payment rail
                        cardDeclineReason: Math.random() > 0.95 ? faker.lorem.sentence() : null, // 5% chance of having card decline reason
                        boPagoFacilMeruReference: Math.random() > 0.9 ? `BO-${InfoGenerator.key().substring(0, 16)}` : null, // 10% chance of having BO PagoFacil reference
                        tesabizTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having Tesabiz transaction ID
                        revenue: Math.random() > 0.7 ? Math.random() * 50 : null, // 30% chance of having revenue
                        usdSentToPartner: Math.random() > 0.8 ? amount * (Math.random() * 0.3 + 0.7) : null, // 20% chance of having USD sent to partner
                        ibanVirtualAccountId: null, // Will be set if needed
                        incomingFireblocksTransactionId: Math.random() > 0.9 ? InfoGenerator.key().substring(0, 20) : null, // 10% chance of having incoming Fireblocks transaction ID
                        controlFixedFeeUsd: Math.random() > 0.8 ? Math.random() * 10 : null, // 20% chance of having control fixed fee USD
                        controlVariableFeeUsd: Math.random() > 0.8 ? amount * 0.02 : null, // 20% chance of having control variable fee USD
                        controlFixedFeeLocal: Math.random() > 0.8 ? Math.random() * 10000 : null, // 20% chance of having control fixed fee local
                        controlVariableFeeLocal: Math.random() > 0.8 ? amount * 100 : null, // 20% chance of having control variable fee local
                        controlProviderFixedFeeUsd: Math.random() > 0.8 ? Math.random() * 5 : null, // 20% chance of having control provider fixed fee USD
                        controlProviderVariableFeeUsd: Math.random() > 0.8 ? amount * 0.01 : null, // 20% chance of having control provider variable fee USD
                        controlProviderFixedFeeLocal: Math.random() > 0.8 ? Math.random() * 5000 : null, // 20% chance of having control provider fixed fee local
                        controlProviderVariableFeeLocal: Math.random() > 0.8 ? amount * 50 : null, // 20% chance of having control provider variable fee local
                        controlMeruTotalRevenue: Math.random() > 0.8 ? Math.random() * 100 : null, // 20% chance of having control Meru total revenue
                        controlMeruGrossMargin: Math.random() > 0.8 ? Math.random() * 50 : null, // 20% chance of having control Meru gross margin
                        completedAt: status === 'COMPLETED' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null, // Set completedAt if status is COMPLETED
                        rejectedAt: status === 'REJECTED' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null, // Set rejectedAt if status is REJECTED
                        blindpayVirtualBankAccountId: null, // Will be set if needed
                        fireblocksGasFeeTransactionId: Math.random() > 0.95 ? InfoGenerator.key().substring(0, 20) : null, // 5% chance of having Fireblocks gas fee transaction ID
                        arQrCodePaymentId: Math.random() > 0.95 ? uuidv4() : null, // 5% chance of having AR QR code payment ID
                        temporalWorkflowId: Math.random() > 0.9 ? uuidv4() : null // 10% chance of having temporal workflow ID
                    };
                    
                    transactions.push(transaction);
                }
            }
            
            // Save to database using createMany
            await this.prisma.transaction.createMany({
                data: transactions,
                skipDuplicates: true
            });
            
            console.log(`Successfully created ${transactions.length} transactions in database`);
            return transactions;
        } catch (error) {
            console.error('Error generating and saving transactions:', error);
            throw error;
        }
    }
} 