import { ColumnMapping, RewriteCsv } from "./rewriter";
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { 
    PrismaClient, 
    DocumentType, 
    BankAccountType, 
    MigrationState, 
    UsdBankAccountRequestStatus, 
    CardRequestStatus, 
    AccountRiskLevel 
} from '@prisma/client';

// Global configuration
const CLEAN_BEFORE_SEED = true; // Set to true to clean existing records before seeding, false to add more data

// Business logic constants
const BUSINESS_CONSTANTS = {
    bankNames: [
        'Banco de Bogotá', 'Banco Popular', 'Bancolombia', 'Banco de Occidente',
        'Banco AV Villas', 'Banco Caja Social', 'Banco Colpatria', 'Banco Davivienda',
        'Banco Falabella', 'Banco Pichincha', 'Banco Santander', 'BBVA Colombia',
        'Citibank Colombia', 'HSBC Colombia', 'Scotiabank Colpatria'
    ],
    countries: ['CO', 'BO', 'AR', 'BR', 'CL', 'MX', 'PE', 'VE', 'EC', 'PY', 'UY'],
    currencies: ['USDC', 'USD', 'EUR', 'COP', 'BRL', 'ARS'],
    kycStatuses: ['APPROVED', 'PENDING', 'REJECTED'],
    addressVerificationStatuses: ['PENDING', 'APPROVED', 'REJECTED'],
    blockReasons: ['SUSPICIOUS_ACTIVITY', 'KYC_FAILED', 'COMPLIANCE_ISSUE'],
    kycDeclineReasons: ['DOCUMENT_EXPIRED', 'DOCUMENT_BLURRY', 'INFORMATION_MISMATCH', 'FRAUD_SUSPECTED'],
    blendVersions: ['v1', 'v2', 'v3']
};

// Helper function to get random enum value
function getRandomEnumValue<T extends Record<string, string>>(enumObj: T): T[keyof T] {
    const values = Object.values(enumObj);
    return values[Math.floor(Math.random() * values.length)] as T[keyof T];
}

export class DatabaseSeeder {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    private async cleanTableIfNeeded(tableName: string) {
        if (CLEAN_BEFORE_SEED) {
            try {
                console.log(`Cleaning existing records from ${tableName}...`);
                
                // Use Prisma's deleteMany to clean the table
                const model = this.prisma[tableName as keyof PrismaClient] as any;
                if (model && typeof model.deleteMany === 'function') {
                    await model.deleteMany({});
                    console.log(`Successfully cleaned ${tableName}`);
                } else {
                    console.warn(`Could not clean ${tableName} - deleteMany method not found`);
                }
            } catch (error) {
                console.error(`Error cleaning ${tableName}:`, error);
                throw error;
            }
        } else {
            console.log(`Skipping cleanup for ${tableName} - adding to existing data`);
        }
    }

    async generateAndSaveUsers(numUsers: number = 5000) {
        try {
            // Clean table if needed
            await this.cleanTableIfNeeded('User');
            
            console.log(`Generating ${numUsers} users...`);
            
            // Generate user data
            const users = [];
            const now = new Date().toISOString();
            
            for (let i = 0; i < numUsers; i++) {
                // Generate user data
                const user = {
                    id: uuidv4(),
                    email: RewriteCsv.generateEmail(),
                    cognitoId: uuidv4(),
                    stellarAccountId: null, // Will be set when stellar account is created
                    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
                    lastSignin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null, // 70% chance of having last signin
                    updatedAt: new Date(now),
                    country: BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                    avatarUrl: Math.random() > 0.7 ? faker.image.avatar() : null, // 30% chance of having avatar
                    kycCompleted: Math.random() > 0.6, // 40% chance of KYC completed
                    kycStatus: Math.random() > 0.6 ? BUSINESS_CONSTANTS.kycStatuses[Math.floor(Math.random() * 3)] : null,
                    kycLastUpdate: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
                    blocked: Math.random() > 0.95, // 5% chance of being blocked
                    paypalConfirmed: Math.random() > 0.8, // 20% chance of PayPal confirmed
                    referralId: Math.random() > 0.7 ? uuidv4() : null, // 30% chance of having referral
                    referralGiftClaimed: Math.random() > 0.8, // 20% chance of referral gift claimed
                    onboardingCompleted: Math.random() > 0.5, // 50% chance of onboarding completed
                    paypalWarningShowed: Math.random() > 0.7, // 30% chance of PayPal warning showed
                    welcomeGiftClaimed: Math.random() > 0.8, // 20% chance of welcome gift claimed
                    ccEnabled: Math.random() > 0.6, // 40% chance of CC enabled
                    phone: Math.random() > 0.3 ? `+${Math.floor(Math.random() * 999) + 1}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null, // 70% chance of having phone
                    phoneIsVerified: Math.random() > 0.4, // 60% chance of phone verified
                    kycCustomerId: Math.random() > 0.6 ? uuidv4() : null, // 40% chance of having KYC customer ID
                    blockReason: Math.random() > 0.95 ? BUSINESS_CONSTANTS.blockReasons[Math.floor(Math.random() * 3)] : null, // 5% chance of having block reason
                    isBusiness: Math.random() > 0.8, // 20% chance of being business account
                    isNonCustodial: Math.random() > 0.9, // 10% chance of being non-custodial
                    shouldConfigureAccount: Math.random() > 0.7, // 30% chance of needing account configuration
                    migrationState: getRandomEnumValue(MigrationState),
                    mainCurrency: BUSINESS_CONSTANTS.currencies[Math.floor(Math.random() * BUSINESS_CONSTANTS.currencies.length)],
                    usdBankAccountRequested: Math.random() > 0.7, // 30% chance of USD bank account requested
                    usdBankAccountRequestStatus: Math.random() > 0.7 ? getRandomEnumValue(UsdBankAccountRequestStatus) : null,
                    usdBankAccountRequestsAttempts: Math.floor(Math.random() * 5), // 0-4 attempts
                    usdBankAccountOpeningFeePaid: Math.random() > 0.8, // 20% chance of opening fee paid
                    meruTermsAndConditionsAccepted: Math.random() > 0.3, // 70% chance of terms accepted
                    addressVerified: Math.random() > 0.6, // 40% chance of address verified
                    addressVerificationStatus: Math.random() > 0.6 ? BUSINESS_CONSTANTS.addressVerificationStatuses[Math.floor(Math.random() * 3)] : null,
                    deleted: Math.random() > 0.98, // 2% chance of being deleted
                    deletedAt: Math.random() > 0.98 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
                    accountRiskLevel: getRandomEnumValue(AccountRiskLevel),
                    accountRiskComment: Math.random() > 0.9 ? faker.lorem.sentence() : null, // 10% chance of having risk comment
                    paypalWithoutLimits: Math.random() > 0.9, // 10% chance of PayPal without limits
                    cardRequestStatus: Math.random() > 0.8 ? getRandomEnumValue(CardRequestStatus) : null,
                    banxaKYCShared: Math.random() > 0.9, // 10% chance of Banxa KYC shared
                    virtualCardRequestFeePaid: Math.random() > 0.8, // 20% chance of virtual card fee paid
                    hasDeFiEnabled: Math.random() > 0.8, // 20% chance of DeFi enabled
                    shouldAskKYC: Math.random() > 0.7, // 30% chance of should ask KYC
                    shouldAskProofOfResidence: Math.random() > 0.7, // 30% chance of should ask proof of residence
                    hasPaymentLinksEnabled: Math.random() > 0.7, // 30% chance of payment links enabled
                    portalUserId: Math.random() > 0.8 ? uuidv4() : null, // 20% chance of having portal user ID
                    hasPSEEnabled: Math.random() > 0.8, // 20% chance of PSE enabled
                    hasWeb3Enabled: Math.random() > 0.9, // 10% chance of Web3 enabled
                    pagoMovilPhoneNumber: Math.random() > 0.8 ? `+58${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null, // 20% chance of having PagoMovil phone
                    mantecaTermsAndConditionsAccepted: Math.random() > 0.8, // 20% chance of Manteca terms accepted
                    hasAbandonedKYCProcess: Math.random() > 0.9, // 10% chance of abandoned KYC process
                    kycDeclineReason: Math.random() > 0.9 ? BUSINESS_CONSTANTS.kycDeclineReasons[Math.floor(Math.random() * 4)] : null, // 10% chance of KYC decline reason
                    kycDuplicatedWithUserId: Math.random() > 0.95 ? uuidv4() : null, // 5% chance of KYC duplicated
                    lastSigninIpAddress: Math.random() > 0.5 ? faker.internet.ip() : null, // 50% chance of having IP address
                    accessedWithMFA: Math.random() > 0.7, // 30% chance of accessed with MFA
                    pinAttempts: Math.floor(Math.random() * 5), // 0-4 pin attempts
                    pinBlocked: Math.random() > 0.95, // 5% chance of pin blocked
                    shouldAskChangePassword: Math.random() > 0.8, // 20% chance of should ask change password
                    accessedWithMagicLink: Math.random() > 0.8, // 20% chance of accessed with magic link
                    hasEmailMFAEnabled: Math.random() > 0.7, // 30% chance of email MFA enabled
                    blendVersion: Math.random() > 0.5 ? BUSINESS_CONSTANTS.blendVersions[Math.floor(Math.random() * 3)] : null, // 50% chance of having blend version
                    appsFlyerUID: Math.random() > 0.7 ? uuidv4() : null, // 30% chance of having AppsFlyer UID
                    guenoUserId: Math.random() > 0.7 ? uuidv4() : null, // 30% chance of having Gueno user ID
                    lastPasswordChangeAt: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null // 40% chance of having last password change
                };
                
                users.push(user);
            }
            
            // Save to database using createMany
            await this.prisma.user.createMany({
                data: users,
                skipDuplicates: true
            });
            
            console.log(`Successfully created ${users.length} users in database`);
            return users;
        } catch (error) {
            console.error('Error generating and saving users:', error);
            throw error;
        }
    }

    async generateAndSaveStellarAccounts(users: any[]) {
        try {
            // Clean table if needed
            await this.cleanTableIfNeeded('StellarAccount');
            
            console.log(`Generating stellar accounts for ${users.length} users...`);
            
            // Generate stellar account data for each user
            const stellarAccounts = [];
            const now = new Date().toISOString();
            
            for (const user of users) {
                // Generate stellar account data
                const stellarAccount = {
                    id: uuidv4(),
                    publicKey: RewriteCsv.key(),
                    secretKey: RewriteCsv.key(),
                    userId: user.id,
                    createdAt: new Date(now),
                    updatedAt: new Date(now)
                };
                
                stellarAccounts.push(stellarAccount);
            }
            
            // Save to database using createMany
            await this.prisma.stellarAccount.createMany({
                data: stellarAccounts,
                skipDuplicates: true
            });
            
            console.log(`Successfully created ${stellarAccounts.length} stellar accounts in database`);
            return stellarAccounts;
        } catch (error) {
            console.error('Error generating and saving stellar accounts:', error);
            throw error;
        }
    }

    async generateAndSaveCustomers(users: any[]) {
        try {
            // Clean table if needed
            await this.cleanTableIfNeeded('Customer');
            
            console.log(`Generating customers for ${users.length} users...`);
            
            // Generate customer data for each user
            const customers = [];
            const now = new Date().toISOString();
            
            for (const user of users) {
                // Generate customer data
                const customer = {
                    id: uuidv4(),
                    userId: user.id,
                    documentType: getRandomEnumValue(DocumentType),
                    documentNumber: RewriteCsv.key().substring(0, 20), // Generate document number
                    documentExpirationDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000), // Random future date
                    documentExpeditionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random past date
                    firstName: RewriteCsv.generateFirstName(),
                    middleName: Math.random() > 0.5 ? RewriteCsv.generateFirstName() : null, // 50% chance of having middle name
                    lastName: RewriteCsv.generateLastName(),
                    address: faker.location.streetAddress(),
                    secondLastName: Math.random() > 0.7 ? RewriteCsv.generateLastName() : null, // 30% chance of having second last name
                    createdAt: new Date(now),
                    updatedAt: new Date(now),
                    city: faker.location.city(),
                    dateOfBirth: new Date(Date.now() - Math.random() * 50 * 365 * 24 * 60 * 60 * 1000) // Random date within last 50 years
                };
                
                customers.push(customer);
            }
            
            // Save to database using createMany
            await this.prisma.customer.createMany({
                data: customers,
                skipDuplicates: true
            });
            
            console.log(`Successfully created ${customers.length} customers in database`);
            return customers;
        } catch (error) {
            console.error('Error generating and saving customers:', error);
            throw error;
        }
    }

    async generateAndSaveBankAccounts(users: any[]) {
        try {
            // Clean table if needed
            await this.cleanTableIfNeeded('BankAccount');
            
            console.log(`Generating bank accounts for ${users.length} users...`);
            
            // Generate bank account data for each user
            const bankAccounts = [];
            const now = new Date().toISOString();
            
            for (const user of users) {
                // Generate 1-3 bank accounts per user (random)
                const numAccounts = Math.floor(Math.random() * 3) + 1;
                
                for (let j = 0; j < numAccounts; j++) {
                    // Generate bank account data
                    const bankAccount = {
                        id: uuidv4(),
                        userId: user.id,
                        beneficiaryName: `${RewriteCsv.generateFirstName()} ${RewriteCsv.generateLastName()}`,
                        documentType: getRandomEnumValue(DocumentType),
                        documentNumber: RewriteCsv.key().substring(0, 20), // Generate document number
                        accountType: getRandomEnumValue(BankAccountType),
                        accountNumber: RewriteCsv.key().substring(0, 15), // Generate account number
                        bankName: BUSINESS_CONSTANTS.bankNames[Math.floor(Math.random() * BUSINESS_CONSTANTS.bankNames.length)],
                        country: BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                        isExternal: Math.random() > 0.7, // 30% chance of being external
                        createdAt: new Date(now),
                        updatedAt: new Date(now),
                        email: Math.random() > 0.3 ? RewriteCsv.generateEmail() : null, // 70% chance of having email
                        bankCode: RewriteCsv.key().substring(0, 8), // Generate bank code
                        beneficiaryAddress: faker.location.streetAddress(),
                        beneficiaryType: Math.random() > 0.5 ? 'PERSONAL' : 'BUSINESS',
                        vitaRawData: null, // Usually null for generated data
                        deleted: false, // Default to not deleted
                        externalProviderId: Math.random() > 0.8 ? RewriteCsv.key().substring(0, 20) : null, // 20% chance
                        externalBankName: Math.random() > 0.8 ? BUSINESS_CONSTANTS.bankNames[Math.floor(Math.random() * BUSINESS_CONSTANTS.bankNames.length)] : null // 20% chance
                    };
                    
                    bankAccounts.push(bankAccount);
                }
            }
            
            // Save to database using createMany
            await this.prisma.bankAccount.createMany({
                data: bankAccounts,
                skipDuplicates: true
            });
            
            console.log(`Successfully created ${bankAccounts.length} bank accounts in database`);
            return bankAccounts;
        } catch (error) {
            console.error('Error generating and saving bank accounts:', error);
            throw error;
        }
    }

    async executeSeed(numUsers: number = 5000) {
        try {
            console.log('Starting database seeding process...');
            console.log(`Configuration: CLEAN_BEFORE_SEED = ${CLEAN_BEFORE_SEED}`);
            
            // Generate and save users first
            const users = await this.generateAndSaveUsers(numUsers);
            
            // Generate and save related data
            await this.generateAndSaveStellarAccounts(users);
            await this.generateAndSaveCustomers(users);
            await this.generateAndSaveBankAccounts(users);
            
            console.log('Database seeding completed successfully!');
        } catch (error) {
            console.error('Error during seeding process:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }

    // Static method to get current configuration
    static getConfiguration() {
        return {
            cleanBeforeSeed: CLEAN_BEFORE_SEED,
            mode: CLEAN_BEFORE_SEED ? 'Clean and seed' : 'Add to existing data'
        };
    }
}

// Run example if this file is executed directly
if (require.main === module) {
    const config = DatabaseSeeder.getConfiguration();
    console.log('=== Database Seeder Configuration ===');
    console.log(`Clean before seed: ${config.cleanBeforeSeed}`);
    console.log(`Mode: ${config.mode}`);
    console.log('=====================================');
    
    const seeder = new DatabaseSeeder();
    seeder.executeSeed();
}