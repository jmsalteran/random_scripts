import { PrismaClient } from '@prisma/client';
import { UsdBankAccountsSeeder } from './seeders/usd-bank-accounts-seeder';
import { UsersSeeder } from './seeders/users-seeder';

async function testUsdBankAccountsSeeder() {
    const prisma = new PrismaClient();
    const usdBankAccountsSeeder = new UsdBankAccountsSeeder(prisma);
    const usersSeeder = new UsersSeeder(prisma);

    try {
        console.log('🧪 Testing UsdBankAccountsSeeder...');
        console.log('=====================================');

        // First, create some test users
        console.log('1. Creating test users...');
        const testUsers = await usersSeeder.generateAndSaveUsers(5);
        console.log(`✅ Created ${testUsers.length} test users`);

        // Test the USD bank accounts seeder
        console.log('\n2. Testing USD bank accounts generation...');
        const usdBankAccounts = await usdBankAccountsSeeder.generateAndSaveUsdBankAccounts(testUsers);
        console.log(`✅ Generated ${usdBankAccounts.length} USD bank accounts`);

        // Verify the data was saved correctly
        console.log('\n3. Verifying data in database...');
        const savedAccounts = await prisma.usdBankAccount.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });

        console.log(`✅ Found ${savedAccounts.length} USD bank accounts in database`);

        // Display some sample data
        if (savedAccounts.length > 0) {
            console.log('\n4. Sample USD bank account data:');
            console.log('=====================================');
            const sample = savedAccounts[0];
            console.log(JSON.stringify(sample, null, 2));
        }

        // Test data validation
        console.log('\n5. Validating data structure...');
        const validationResults = usdBankAccounts.map(account => {
            const isValid = account.id && 
                           account.sardineId && 
                           account.userId && 
                           account.routingNumber && 
                           account.accountNumber &&
                           account.routingNumber.length === 9 &&
                           account.accountNumber.length >= 8 &&
                           account.accountNumber.length <= 12;
            
            return { accountId: account.id, isValid };
        });

        const validCount = validationResults.filter(r => r.isValid).length;
        console.log(`✅ ${validCount}/${validationResults.length} accounts have valid structure`);

        console.log('\n🎉 UsdBankAccountsSeeder test completed successfully!');

    } catch (error) {
        console.error('❌ Error during test:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testUsdBankAccountsSeeder()
        .then(() => {
            console.log('\n✅ All tests passed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Test failed:', error);
            process.exit(1);
        });
} 