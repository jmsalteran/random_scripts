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

    async cleanAllTablesInOrder() {
        if (CLEAN_BEFORE_SEED) {
            console.log('Cleaning all tables in dependency order...');
            
            // Clean dependent tables first (in reverse dependency order)
            await this.cleanTableIfNeeded('Transaction');
            await this.cleanTableIfNeeded('BankAccount');
            await this.cleanTableIfNeeded('Customer');
            await this.cleanTableIfNeeded('StellarAccount');
            
            // Clean parent table last
            await this.cleanTableIfNeeded('User');
            
            console.log('All tables cleaned successfully');
        }
    }
} 