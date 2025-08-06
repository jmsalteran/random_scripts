// Business logic constants shared across seeders
export const BUSINESS_CONSTANTS = {
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

// Global configuration
export const CLEAN_BEFORE_SEED = true; // Set to true to clean existing records before seeding, false to add more data 