import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient, UsdBankAccountStatus } from '@prisma/client';
import { InfoGenerator } from "../info-generator";

import { BUSINESS_CONSTANTS } from "./shared/constants";
import { getRandomEnumValue } from "./shared/utils";

export class UsdBankAccountsSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveUsdBankAccounts(users: any[]) {
        try {
            // Generate USD bank account data for each user
            const usdBankAccounts = [];
            const now = new Date().toISOString();
            
            for (const user of users) {
                // Generate 0-1 USD bank account per user (not all users have USD accounts)
                if (Math.random() > 0.7) { // 30% chance of having a USD bank account
                    // Generate USD bank account data
                    const usdBankAccount = {
                        id: uuidv4(),
                        sardineId: `sardine_${InfoGenerator.key().substring(0, 20)}`,
                        userId: user.id,
                        accountHolderName: `${InfoGenerator.generateFirstName()} ${InfoGenerator.generateLastName()}`,
                        routingNumber: this.generateRoutingNumber(),
                        accountNumber: this.generateAccountNumber(),
                        type: Math.random() > 0.5 ? 'CHECKING' : 'SAVINGS',
                        sponsorBankName: this.getRandomUSBankName(),
                        sponsorBankAddress: faker.location.streetAddress({ useFullAddress: true }),
                        status: getRandomEnumValue(UsdBankAccountStatus),
                        createdAt: new Date(now),
                        updatedAt: new Date(now)
                    };
                    
                    usdBankAccounts.push(usdBankAccount);
                }
            }
            
            // Save to database using createMany
            await this.prisma.usdBankAccount.createMany({
                data: usdBankAccounts,
                skipDuplicates: true
            });
            
            return usdBankAccounts;
        } catch (error) {
            console.error('Error generating and saving USD bank accounts:', error);
            throw error;
        }
    }

    private generateRoutingNumber(): string {
        // Generate a 9-digit routing number (US bank routing numbers are 9 digits)
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    }

    private generateAccountNumber(): string {
        // Generate a 8-12 digit account number
        const length = Math.floor(Math.random() * 5) + 8; // 8-12 digits
        return Math.floor(Math.pow(10, length - 1) + Math.random() * Math.pow(10, length - 1)).toString();
    }

    private getRandomUSBankName(): string {
        const usBanks = [
            'Chase Bank',
            'Bank of America',
            'Wells Fargo',
            'Citibank',
            'U.S. Bank',
            'PNC Bank',
            'Capital One',
            'TD Bank',
            'Goldman Sachs',
            'Morgan Stanley',
            'American Express Bank',
            'HSBC Bank USA',
            'Citizens Bank',
            'Fifth Third Bank',
            'KeyBank',
            'Regions Bank',
            'BB&T Bank',
            'SunTrust Bank',
            'BMO Harris Bank',
            'Ally Bank'
        ];
        return usBanks[Math.floor(Math.random() * usBanks.length)];
    }
} 