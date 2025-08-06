import { PrismaClient } from '@prisma/client';
import { 
    UsersSeeder, 
    StellarAccountsSeeder, 
    CustomersSeeder, 
    BankAccountsSeeder, 
    UsdBankAccountsSeeder,
    TransactionsSeeder, 
    DevicesSeeder,
    KYCCustomersSeeder,
    FireblocksVaultSeeder,
    DatabaseCleaner, 
    CLEAN_BEFORE_SEED 
} from './seeders';

export class DatabaseSeeder {
    private prisma: PrismaClient;
    private usersSeeder: UsersSeeder;
    private stellarAccountsSeeder: StellarAccountsSeeder;
    private customersSeeder: CustomersSeeder;
    private bankAccountsSeeder: BankAccountsSeeder;
    private usdBankAccountsSeeder: UsdBankAccountsSeeder;
    private transactionsSeeder: TransactionsSeeder;
    private devicesSeeder: DevicesSeeder;
    private kycCustomersSeeder: KYCCustomersSeeder;
    private fireblocksVaultSeeder: FireblocksVaultSeeder;
    private databaseCleaner: DatabaseCleaner;

    constructor() {
        this.prisma = new PrismaClient();
        this.usersSeeder = new UsersSeeder(this.prisma);
        this.stellarAccountsSeeder = new StellarAccountsSeeder(this.prisma);
        this.customersSeeder = new CustomersSeeder(this.prisma);
        this.bankAccountsSeeder = new BankAccountsSeeder(this.prisma);
        this.usdBankAccountsSeeder = new UsdBankAccountsSeeder(this.prisma);
        this.transactionsSeeder = new TransactionsSeeder(this.prisma);
        this.devicesSeeder = new DevicesSeeder(this.prisma);
        this.kycCustomersSeeder = new KYCCustomersSeeder(this.prisma);
        this.fireblocksVaultSeeder = new FireblocksVaultSeeder(this.prisma);
        this.databaseCleaner = new DatabaseCleaner(this.prisma);
    }

    async executeSeed(numUsers: number = 5000) {
        try {
            // Clean all tables in dependency order first
            await this.databaseCleaner.cleanAllTablesInOrder();
            
            // Generate and save users first
            let users = await this.usersSeeder.generateAndSaveUsers(numUsers);
            users = await this.usersSeeder.checkUsers(users);
            
            // Generate and save related data
            await this.stellarAccountsSeeder.generateAndSaveStellarAccounts(users);
            await this.customersSeeder.generateAndSaveCustomers(users);
            await this.bankAccountsSeeder.generateAndSaveBankAccounts(users);
            await this.usdBankAccountsSeeder.generateAndSaveUsdBankAccounts(users);
            await this.devicesSeeder.generateAndSaveDevices(users);
            await this.kycCustomersSeeder.generateAndSaveKYCCustomers(users);
            await this.fireblocksVaultSeeder.generateAndSaveFireblocksVaults(users);
            await this.transactionsSeeder.generateAndSaveTransactions(users);
            
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