import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { 
    PrismaClient, 
    MigrationState, 
    UsdBankAccountRequestStatus, 
    CardRequestStatus, 
    AccountRiskLevel
} from '@prisma/client';
import { InfoGenerator } from "../info-generator";

import { BUSINESS_CONSTANTS } from "./shared/constants";
import { getRandomEnumValue } from "./shared/utils";

export class UsersSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveUsers(numUsers: number = 5000) {
        try {
            console.log(`Generating ${numUsers} users...`);
            
            // Generate user data
            const users = [];
            const now = new Date().toISOString();
            
            for (let i = 0; i < numUsers; i++) {
                // Generate user data
                const user = {
                    id: uuidv4(),
                    email: InfoGenerator.generateEmail(),
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
                    referralId: null, // Set to null to avoid foreign key constraint issues
                    referralGiftClaimed: Math.random() > 0.8, // 20% chance of referral gift claimed
                    onboardingCompleted: Math.random() > 0.5, // 50% chance of onboarding completed
                    paypalWarningShowed: Math.random() > 0.7, // 30% chance of PayPal warning showed
                    welcomeGiftClaimed: Math.random() > 0.8, // 20% chance of welcome gift claimed
                    ccEnabled: Math.random() > 0.6, // 40% chance of CC enabled
                    phone: Math.random() > 0.3 ? `+${Math.floor(Math.random() * 999) + 1}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null, // 70% chance of having phone
                    phoneIsVerified: Math.random() > 0.4, // 60% chance of phone verified
                    kycCustomerId: null, // Set to null to avoid foreign key constraint issues
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
                    portalUserId: null, // Set to null to avoid foreign key constraint issues
                    hasPSEEnabled: Math.random() > 0.8, // 20% chance of PSE enabled
                    hasWeb3Enabled: Math.random() > 0.9, // 10% chance of Web3 enabled
                    pagoMovilPhoneNumber: Math.random() > 0.8 ? `+58${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` : null, // 20% chance of having PagoMovil phone
                    mantecaTermsAndConditionsAccepted: Math.random() > 0.8, // 20% chance of Manteca terms accepted
                    hasAbandonedKYCProcess: Math.random() > 0.9, // 10% chance of abandoned KYC process
                    kycDeclineReason: Math.random() > 0.9 ? BUSINESS_CONSTANTS.kycDeclineReasons[Math.floor(Math.random() * 4)] : null, // 10% chance of KYC decline reason
                    kycDuplicatedWithUserId: null, // Set to null to avoid foreign key constraint issues
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

    async checkUsers(users: any[]){
        // Before creating stellar accounts, check if all these users exist in the database
        const userIds = users.map(u => u.id);
        const existingUsers = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true }
        });
        const existingUserIds = new Set(existingUsers.map(u => u.id));
        const missingUserIds = userIds.filter(id => !existingUserIds.has(id));
        if (missingUserIds.length > 0) {
            // Remove users whose IDs are missing from the database and return the filtered list
            const filteredUsers = users.filter(u => existingUserIds.has(u.id));
            return filteredUsers;
        }
        return users;
    }
} 