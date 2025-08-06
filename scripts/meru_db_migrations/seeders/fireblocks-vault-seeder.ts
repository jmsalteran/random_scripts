import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { InfoGenerator } from "../info-generator";

export class FireblocksVaultSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveFireblocksVaults(users: any[]) {
        try {
            // Generate fireblocks vault data for each user
            const fireblocksVaults = [];
            const now = new Date().toISOString();

            for (const user of users) {
                // Generate fireblocks vault data
                const fireblocksVault = {
                    id: uuidv4(),
                    userId: user.id,
                    fireblocksVaultId: `vault_${InfoGenerator.generateUuid4()}`,
                    active: true,
                    createdAt: new Date(now),
                    updatedAt: new Date(now),
                    stellarDepositAddress: this.generateStellarDepositAddress(),
                    stellarDepositMemo: this.generateStellarDepositMemo()
                };
                
                fireblocksVaults.push(fireblocksVault);
            }
            
            // Save to database using createMany
            await this.prisma.fireblocksVault.createMany({
                data: fireblocksVaults,
                skipDuplicates: true
            });
            
            return fireblocksVaults;
        } catch (error) {
            console.error('Error generating and saving fireblocks vaults:', error);
            throw error;
        }
    }

    private generateStellarDepositAddress(): string {
        // Generate a Stellar address similar to the example: GAMNA2Q6NTZSUBLMEXLTIXYORE7OXJJBMEGIX7T2OXDAKIA7CCKN4RJV
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let result = 'G';
        for (let i = 0; i < 55; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    private generateStellarDepositMemo(): string {
        // Generate a memo similar to the example: 2229224172
        return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    }
} 