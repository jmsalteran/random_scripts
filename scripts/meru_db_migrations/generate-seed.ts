import { ColumnMapping, RewriteCsv } from "./rewriter";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { DatabaseWriter } from './db-writer';
import { 
    PrismaClient, 
    DocumentType, 
    BankAccountType, 
    MigrationState, 
    UsdBankAccountRequestStatus, 
    CardRequestStatus, 
    AccountRiskLevel 
} from '@prisma/client';

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
function getRandomEnumValue<T extends Record<string, string>>(enumObj: T): string {
    const values = Object.values(enumObj);
    return values[Math.floor(Math.random() * values.length)];
}

async function settingUpUsers() {
    try {
        // Generate user data
        const users = [];
        const now = new Date().toISOString();
        
        // Generate 100 users (or any desired number)
        const numUsers = 5000;
        
        for (let i = 0; i < numUsers; i++) {
            // Generate user data
            const user = {
                id: uuidv4(),
                email: RewriteCsv.generateEmail(),
                cognitoId: uuidv4(),
                stellarAccountId: null, // Will be set when stellar account is created
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last year
                lastSignin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null, // 70% chance of having last signin
                updatedAt: now,
                country: BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                avatarUrl: Math.random() > 0.7 ? faker.image.avatar() : null, // 30% chance of having avatar
                kycCompleted: Math.random() > 0.6, // 40% chance of KYC completed
                kycStatus: Math.random() > 0.6 ? BUSINESS_CONSTANTS.kycStatuses[Math.floor(Math.random() * 3)] : null,
                kycLastUpdate: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
                blocked: Math.random() > 0.95, // 5% chance of being blocked
                cashPayments: [], // Array, not included in CSV
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
                deletedAt: Math.random() > 0.98 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
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
                lastPasswordChangeAt: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : null // 40% chance of having last password change
            };
            
            users.push(user);
        }
        
        // Create CSV content for users
        const userHeaders = [
            'id', 'email', 'cognitoId', 'stellarAccountId', 'createdAt', 'lastSignin', 'updatedAt', 'country', 'avatarUrl',
            'kycCompleted', 'kycStatus', 'kycLastUpdate', 'blocked', 'paypalConfirmed', 'referralId', 'referralGiftClaimed',
            'onboardingCompleted', 'paypalWarningShowed', 'welcomeGiftClaimed', 'ccEnabled', 'phone', 'phoneIsVerified',
            'kycCustomerId', 'blockReason', 'isBusiness', 'isNonCustodial', 'shouldConfigureAccount', 'migrationState',
            'mainCurrency', 'usdBankAccountRequested', 'usdBankAccountRequestStatus', 'usdBankAccountRequestsAttempts',
            'usdBankAccountOpeningFeePaid', 'meruTermsAndConditionsAccepted', 'addressVerified', 'addressVerificationStatus',
            'deleted', 'deletedAt', 'accountRiskLevel', 'accountRiskComment', 'paypalWithoutLimits', 'cardRequestStatus',
            'banxaKYCShared', 'virtualCardRequestFeePaid', 'hasDeFiEnabled', 'shouldAskKYC', 'shouldAskProofOfResidence',
            'hasPaymentLinksEnabled', 'portalUserId', 'hasPSEEnabled', 'hasWeb3Enabled', 'pagoMovilPhoneNumber',
            'mantecaTermsAndConditionsAccepted', 'hasAbandonedKYCProcess', 'kycDeclineReason', 'kycDuplicatedWithUserId',
            'lastSigninIpAddress', 'accessedWithMFA', 'pinAttempts', 'pinBlocked', 'shouldAskChangePassword',
            'accessedWithMagicLink', 'hasEmailMFAEnabled', 'blendVersion', 'appsFlyerUID', 'guenoUserId', 'lastPasswordChangeAt'
        ];
        
        const csvContent = [
            userHeaders.join(','),
            ...users.map(user => [
                user.id,
                user.email,
                user.cognitoId,
                user.stellarAccountId || '',
                user.createdAt,
                user.lastSignin || '',
                user.updatedAt,
                user.country,
                user.avatarUrl || '',
                user.kycCompleted,
                user.kycStatus || '',
                user.kycLastUpdate || '',
                user.blocked,
                user.paypalConfirmed,
                user.referralId || '',
                user.referralGiftClaimed,
                user.onboardingCompleted,
                user.paypalWarningShowed,
                user.welcomeGiftClaimed,
                user.ccEnabled,
                user.phone || '',
                user.phoneIsVerified,
                user.kycCustomerId || '',
                user.blockReason || '',
                user.isBusiness,
                user.isNonCustodial,
                user.shouldConfigureAccount,
                user.migrationState,
                user.mainCurrency,
                user.usdBankAccountRequested,
                user.usdBankAccountRequestStatus || '',
                user.usdBankAccountRequestsAttempts,
                user.usdBankAccountOpeningFeePaid,
                user.meruTermsAndConditionsAccepted,
                user.addressVerified,
                user.addressVerificationStatus || '',
                user.deleted,
                user.deletedAt || '',
                user.accountRiskLevel,
                user.accountRiskComment || '',
                user.paypalWithoutLimits,
                user.cardRequestStatus || '',
                user.banxaKYCShared,
                user.virtualCardRequestFeePaid,
                user.hasDeFiEnabled,
                user.shouldAskKYC,
                user.shouldAskProofOfResidence,
                user.hasPaymentLinksEnabled,
                user.portalUserId || '',
                user.hasPSEEnabled,
                user.hasWeb3Enabled,
                user.pagoMovilPhoneNumber || '',
                user.mantecaTermsAndConditionsAccepted,
                user.hasAbandonedKYCProcess,
                user.kycDeclineReason || '',
                user.kycDuplicatedWithUserId || '',
                user.lastSigninIpAddress || '',
                user.accessedWithMFA,
                user.pinAttempts,
                user.pinBlocked,
                user.shouldAskChangePassword,
                user.accessedWithMagicLink,
                user.hasEmailMFAEnabled,
                user.blendVersion || '',
                user.appsFlyerUID || '',
                user.guenoUserId || '',
                user.lastPasswordChangeAt || ''
            ].join(','))
        ].join('\n');
        
        // If the file already exists, remove it before creating a new one
        if (fs.existsSync('./data/users.csv')) {
            fs.unlinkSync('./data/users.csv');
        }
        
        fs.writeFileSync('./data/users.csv', csvContent, 'utf-8');
        
        console.log(`Generated ${users.length} user rows in data/users.csv`);
        console.log('Users CSV file created successfully!');
    } catch (error) {
        console.error('Error generating users CSV:', error);
    }
}

function readCsvAndGetColumnIndex(filePath: string, columnName: string): { lines: string[], columnIndex: number } {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const lines = fileData.split('\n');
    const headers = lines[0].split(',');
    const columnIndex = headers.findIndex(header => header === columnName);
    if (columnIndex === -1) {
        throw new Error(`${columnName} column not found in CSV`);
    }
    return { lines, columnIndex };
}

async function settingUpStellarAccountFromUsers() {
    try {
        // Use the utility function for users.csv and 'id' column
        const { lines, columnIndex: userIdIndex } = readCsvAndGetColumnIndex('./data/users.csv', 'id');
        
        // Generate stellar account data for each user
        const stellarAccounts = [];
        const now = new Date().toISOString();
        
        // Process each user (skip header row)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const userId = values[userIdIndex];
            
            if (!userId) continue;
            
            // Generate stellar account data
            const stellarAccount = {
                id: uuidv4(),
                publicKey: RewriteCsv.key(),
                secretKey: RewriteCsv.key(),
                userId: userId,
                createdAt: now,
                updatedAt: now
            };
            
            stellarAccounts.push(stellarAccount);
        }
        
        // Create CSV content for stellar accounts
        const stellarAccountHeaders = ['id', 'publicKey', 'secretKey', 'userId', 'createdAt', 'updatedAt'];
        const csvContent = [
            stellarAccountHeaders.join(','),
            ...stellarAccounts.map(account => [
                account.id,
                account.publicKey,
                account.secretKey,
                account.userId,
                account.createdAt,
                account.updatedAt
            ].join(','))
        ].join('\n');
        
        // If the file already exists, remove it before creating a new one
        if (fs.existsSync('./data/stellar_accounts.csv')) {
            fs.unlinkSync('./data/stellar_accounts.csv');
        }
        fs.writeFileSync('./data/stellar_accounts.csv', csvContent, 'utf-8');
        
        console.log(`Generated ${stellarAccounts.length} stellar account rows in data/stellar_accounts.csv`);
        console.log('Stellar accounts CSV file created successfully!');
    } catch (error) {
        console.error('Error generating stellar accounts CSV:', error);
    }
}

async function settingUpCustomerFromUsers() {
    try {
        // Read the users.csv file
        const { lines, columnIndex: userIdIndex } = readCsvAndGetColumnIndex('./data/users.csv', 'id');
        
        // Generate customer data for each user
        const customers = [];
        const now = new Date().toISOString();
        
        // Process each user (skip header row)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const userId = values[userIdIndex];
            
            if (!userId) continue;
            
            // Generate customer data
            const customer = {
                id: uuidv4(),
                userId: userId,
                documentType: getRandomEnumValue(DocumentType),
                documentNumber: RewriteCsv.key().substring(0, 20), // Generate document number
                documentExpirationDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Random future date
                documentExpeditionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Random past date
                firstName: RewriteCsv.generateFirstName(),
                middleName: Math.random() > 0.5 ? RewriteCsv.generateFirstName() : null, // 50% chance of having middle name
                lastName: RewriteCsv.generateLastName(),
                address: faker.location.streetAddress(),
                secondLastName: Math.random() > 0.7 ? RewriteCsv.generateLastName() : null, // 30% chance of having second last name
                createdAt: now,
                updatedAt: now,
                city: faker.location.city(),
                dateOfBirth: new Date(Date.now() - Math.random() * 50 * 365 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 50 years
            };
            
            customers.push(customer);
        }
        
        // Create CSV content for customers
        const customerHeaders = [
            'id', 'userId', 'documentType', 'documentNumber', 'documentExpirationDate', 
            'documentExpeditionDate', 'firstName', 'middleName', 'lastName', 'address', 
            'secondLastName', 'createdAt', 'updatedAt', 'city', 'dateOfBirth'
        ];
        
        const csvContent = [
            customerHeaders.join(','),
            ...customers.map(customer => [
                customer.id,
                customer.userId,
                customer.documentType,
                customer.documentNumber,
                customer.documentExpirationDate,
                customer.documentExpeditionDate,
                customer.firstName,
                customer.middleName || '',
                customer.lastName,
                customer.address,
                customer.secondLastName || '',
                customer.createdAt,
                customer.updatedAt,
                customer.city,
                customer.dateOfBirth
            ].join(','))
        ].join('\n');
        
        // If the file already exists, remove it before creating a new one
        if (fs.existsSync('./data/customers.csv')) {
            fs.unlinkSync('./data/customers.csv');
        }
        
        fs.writeFileSync('./data/customers.csv', csvContent, 'utf-8');
        
        console.log(`Generated ${customers.length} customer rows in data/customers.csv`);
        console.log('Customers CSV file created successfully!');
    } catch (error) {
        console.error('Error generating customer CSV:', error);
    }
}

async function settingUpBankAccountFromUsers() {
    try {
        // Read the users.csv file
        const { lines, columnIndex: userIdIndex } = readCsvAndGetColumnIndex('./data/users.csv', 'id');

        // Generate bank account data for each user
        const bankAccounts = [];
        const now = new Date().toISOString();
        
        // Process each user (skip header row)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            const userId = values[userIdIndex];
            
            if (!userId) continue;
            
            // Generate 1-3 bank accounts per user (random)
            const numAccounts = Math.floor(Math.random() * 3) + 1;
            
            for (let j = 0; j < numAccounts; j++) {
                // Generate bank account data
                const bankAccount = {
                    id: uuidv4(),
                    userId: userId,
                    beneficiaryName: `${RewriteCsv.generateFirstName()} ${RewriteCsv.generateLastName()}`,
                    documentType: getRandomEnumValue(DocumentType),
                    documentNumber: RewriteCsv.key().substring(0, 20), // Generate document number
                    accountType: getRandomEnumValue(BankAccountType),
                    accountNumber: RewriteCsv.key().substring(0, 15), // Generate account number
                    bankName: BUSINESS_CONSTANTS.bankNames[Math.floor(Math.random() * BUSINESS_CONSTANTS.bankNames.length)],
                    country: BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                    isExternal: Math.random() > 0.7, // 30% chance of being external
                    createdAt: now,
                    updatedAt: now,
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
        
        // Create CSV content for bank accounts
        const bankAccountHeaders = [
            'id', 'userId', 'beneficiaryName', 'documentType', 'documentNumber', 
            'accountType', 'accountNumber', 'bankName', 'country', 'isExternal',
            'createdAt', 'updatedAt', 'email', 'bankCode', 'beneficiaryAddress',
            'beneficiaryType', 'vitaRawData', 'deleted', 'externalProviderId', 'externalBankName'
        ];
        
        const csvContent = [
            bankAccountHeaders.join(','),
            ...bankAccounts.map(account => [
                account.id,
                account.userId,
                account.beneficiaryName,
                account.documentType,
                account.documentNumber,
                account.accountType,
                account.accountNumber,
                account.bankName,
                account.country,
                account.isExternal,
                account.createdAt,
                account.updatedAt,
                account.email || '',
                account.bankCode,
                account.beneficiaryAddress,
                account.beneficiaryType,
                account.vitaRawData || '',
                account.deleted,
                account.externalProviderId || '',
                account.externalBankName || ''
            ].join(','))
        ].join('\n');
        
        // If the file already exists, remove it before creating a new one
        if (fs.existsSync('./data/bank_accounts.csv')) {
            fs.unlinkSync('./data/bank_accounts.csv');
        }
        
        fs.writeFileSync('./data/bank_accounts.csv', csvContent, 'utf-8');
        
        console.log(`Generated ${bankAccounts.length} bank account rows in data/bank_accounts.csv`);
        console.log('Bank accounts CSV file created successfully!');
    } catch (error) {
        console.error('Error generating bank account CSV:', error);
    }
}

async function executeSeed() {
    settingUpUsers();
    settingUpStellarAccountFromUsers();
    settingUpCustomerFromUsers();
    settingUpBankAccountFromUsers();

    const writer = new DatabaseWriter();
    await writer.processCsvFile('./data/users.csv', 'User');
    // await writer.processCsvFile('./data/customers.csv', 'Customer');
    // await writer.processCsvFile('./data/bank_accounts.csv', 'BankAccount');
    // await writer.processCsvFile('./data/stellar_accounts.csv', 'StellarAccount');
    await writer.disconnect();
}

// Run example if this file is executed directly
if (require.main === module) {
    executeSeed()
}