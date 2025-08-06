import { PrismaClient } from '@prisma/client';
import { CLEAN_BEFORE_SEED } from './constants';

export class DatabaseCleaner {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    private async cleanTableIfNeeded(tableName: string) {
        if (CLEAN_BEFORE_SEED) {
            try {
                
                // Use Prisma's deleteMany to clean the table
                const model = this.prisma[tableName as keyof PrismaClient] as any;
                if (model && typeof model.deleteMany === 'function') {
                    await model.deleteMany({});
                } else {
                    console.warn(`Could not clean ${tableName} - deleteMany method not found`);
                }
            } catch (error) {
                console.error(`Error cleaning ${tableName}:`, error);
                throw error;
            }
        }
    }

    async cleanAllTablesInOrder() {
        if (CLEAN_BEFORE_SEED) {
            
            // Clean dependent tables first (in reverse dependency order)
            await this.cleanTableIfNeeded('Transaction');
            await this.cleanTableIfNeeded('BankAccount');
            await this.cleanTableIfNeeded('Customer');
            await this.cleanTableIfNeeded('Device');
            await this.cleanTableIfNeeded('KYCCustomer');
            await this.cleanTableIfNeeded('StellarAccount');
            
            // Clean Fireblocks-related tables (they reference User)
            await this.cleanTableIfNeeded('FireblocksVault');
            // await this.cleanTableIfNeeded('PaybisFireblocksVault');
            // await this.cleanTableIfNeeded('BinanceFireblocksVault');
            // await this.cleanTableIfNeeded('USDBankAccountFireblocksVault');
            // await this.cleanTableIfNeeded('CardDepositFireblocksVault');
            
            // Clean parent table last
            await this.cleanTableIfNeeded('User');
        }
    }
} 