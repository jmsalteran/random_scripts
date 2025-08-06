import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { InfoGenerator } from "../info-generator";

export class StellarAccountsSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveStellarAccounts(users: any[]) {
        try {
            
            // Generate stellar account data for each user
            const stellarAccounts = [];
            const now = new Date().toISOString();

            
            for (const user of users) {
                // Generate stellar account data
                const stellarAccount = {
                    id: uuidv4(),
                    publicKey: InfoGenerator.key(),
                    secretKey: InfoGenerator.key(),
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
            
            return stellarAccounts;
        } catch (error) {
            console.error('Error generating and saving stellar accounts:', error);
            throw error;
        }
    }
} 