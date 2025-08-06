import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient, DocumentType, BankAccountType } from '@prisma/client';
import { InfoGenerator } from "../info-generator";

import { BUSINESS_CONSTANTS } from "./shared/constants";
import { getRandomEnumValue } from "./shared/utils";

export class BankAccountsSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveBankAccounts(users: any[]) {
        try {
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
                        beneficiaryName: `${InfoGenerator.generateFirstName()} ${InfoGenerator.generateLastName()}`,
                        documentType: getRandomEnumValue(DocumentType),
                        documentNumber: InfoGenerator.key().substring(0, 20), // Generate document number
                        accountType: getRandomEnumValue(BankAccountType),
                        accountNumber: InfoGenerator.key().substring(0, 15), // Generate account number
                        bankName: BUSINESS_CONSTANTS.bankNames[Math.floor(Math.random() * BUSINESS_CONSTANTS.bankNames.length)],
                        country: BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                        isExternal: Math.random() > 0.7, // 30% chance of being external
                        createdAt: new Date(now),
                        updatedAt: new Date(now),
                        email: Math.random() > 0.3 ? InfoGenerator.generateEmail() : null, // 70% chance of having email
                        bankCode: InfoGenerator.key().substring(0, 8), // Generate bank code
                        beneficiaryAddress: faker.location.streetAddress(),
                        beneficiaryType: Math.random() > 0.5 ? 'PERSONAL' : 'BUSINESS',
                        vitaRawData: null, // Usually null for generated data
                        deleted: false, // Default to not deleted
                        externalProviderId: Math.random() > 0.8 ? InfoGenerator.key().substring(0, 20) : null, // 20% chance
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
            
            return bankAccounts;
        } catch (error) {
            console.error('Error generating and saving bank accounts:', error);
            throw error;
        }
    }
} 