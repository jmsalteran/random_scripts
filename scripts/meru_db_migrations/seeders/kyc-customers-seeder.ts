import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { BUSINESS_CONSTANTS } from './shared/constants';

export class KYCCustomersSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveKYCCustomers(users: any[]) {
        try {
            // Filter users who have completed KYC (approximately 40% based on the user seeder logic)
            const usersWithKYC = users.filter(user => user.kycCompleted);
            
            const kycCustomers = [];
            
            for (const user of usersWithKYC) {
                const kycCustomer = {
                    id: uuidv4(),
                    userId: user.id,
                    fullName: faker.person.fullName(),
                    firstName: faker.person.firstName(),
                    surname: faker.person.lastName(),
                    documentNumber: this.generateDocumentNumber(),
                    dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
                    expirationDate: faker.date.future({ years: 10 }).toISOString().split('T')[0],
                    documentType: BUSINESS_CONSTANTS.countries.includes(user.country) ? this.getDocumentTypeForCountry(user.country) : 'PASSPORT',
                    issueCountry: user.country || BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                    nationality: user.country || BUSINESS_CONSTANTS.countries[Math.floor(Math.random() * BUSINESS_CONSTANTS.countries.length)],
                    sex: Math.random() > 0.5 ? 'M' : 'F',
                    documentPhotoUrl: Math.random() > 0.7 ? faker.image.url() : null,
                    providerUrl: Math.random() > 0.8 ? faker.internet.url() : null,
                    providerId: Math.random() > 0.6 ? uuidv4() : null,
                    lastSuccessVerificationProviderId: Math.random() > 0.6 ? uuidv4() : null,
                    provider: Math.random() > 0.6 ? this.getRandomProvider() : null,
                    createdAt: user.createdAt,
                    updatedAt: new Date(),
                    mxCURP: user.country === 'MX' && Math.random() > 0.7 ? this.generateMexicanCURP() : null,
                    clRunNumber: user.country === 'CL' && Math.random() > 0.7 ? this.generateChileanRUN() : null,
                    migrated: Math.random() > 0.9,
                    personNumber: Math.random() > 0.8 ? faker.string.numeric(8) : null,
                    arCuit: user.country === 'AR' && Math.random() > 0.7 ? this.generateArgentineCUIT() : null,
                    usSSN: user.country === 'US' && Math.random() > 0.7 ? this.generateUSSSN() : null,
                    brCPF: user.country === 'BR' && Math.random() > 0.7 ? this.generateBrazilianCPF() : null,
                    taxIdentificationNumber: Math.random() > 0.8 ? faker.string.numeric(10) : null
                };
                
                kycCustomers.push(kycCustomer);
            }

            // Save KYC customers to database
            const savedKYCCustomers = await this.prisma.kYCCustomer.createMany({
                data: kycCustomers,
                skipDuplicates: true
            });

            return kycCustomers;
        } catch (error) {
            console.error('Error generating and saving KYC customers:', error);
            throw error;
        }
    }

    private generateDocumentNumber(): string {
        // Generate a realistic document number (8-12 digits)
        return faker.string.numeric({ length: { min: 8, max: 12 } });
    }

    private getDocumentTypeForCountry(country: string): string {
        const documentTypes: { [key: string]: string[] } = {
            'CO': ['CC', 'CE', 'PP'],
            'BO': ['CI', 'PP'],
            'AR': ['DNI', 'PP'],
            'BR': ['CPF', 'PP'],
            'CL': ['RUN', 'PP'],
            'MX': ['INE', 'CURP', 'PP'],
            'PE': ['DNI', 'PP'],
            'VE': ['CI_VE', 'PP'],
            'EC': ['CI', 'PP'],
            'PY': ['CI', 'PP'],
            'UY': ['CI', 'PP']
        };
        
        const types = documentTypes[country] || ['PP'];
        return types[Math.floor(Math.random() * types.length)];
    }

    private getRandomProvider(): string {
        const providers = ['Jumio', 'Onfido', 'Veriff', 'Sumsub', 'Persona'];
        return providers[Math.floor(Math.random() * providers.length)];
    }

    private generateMexicanCURP(): string {
        // Generate a realistic Mexican CURP format (18 characters)
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const vowels = 'AEIOU';
        const consonants = 'BCDFGHJKLMNÑPQRSTVWXYZ';
        
        let curp = '';
        
        // First 4 letters (first letter of first surname, first vowel of first surname, first letter of second surname, first letter of first name)
        curp += letters[Math.floor(Math.random() * letters.length)];
        curp += vowels[Math.floor(Math.random() * vowels.length)];
        curp += letters[Math.floor(Math.random() * letters.length)];
        curp += letters[Math.floor(Math.random() * letters.length)];
        
        // Date of birth (YYMMDD)
        const year = Math.floor(Math.random() * 50) + 50; // 1950-1999
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        curp += `${year}${month}${day}`;
        
        // Gender (H or M)
        curp += Math.random() > 0.5 ? 'H' : 'M';
        
        // State code (2 letters)
        curp += letters[Math.floor(Math.random() * letters.length)];
        curp += letters[Math.floor(Math.random() * letters.length)];
        
        // Consonants from surnames and names
        curp += consonants[Math.floor(Math.random() * consonants.length)];
        curp += consonants[Math.floor(Math.random() * consonants.length)];
        curp += consonants[Math.floor(Math.random() * consonants.length)];
        
        // Homoclave (2 digits)
        curp += faker.string.numeric(2);
        
        return curp;
    }

    private generateChileanRUN(): string {
        // Generate a realistic Chilean RUN (8 digits + check digit)
        const run = faker.string.numeric(8);
        const checkDigit = this.calculateChileanCheckDigit(run);
        return `${run}-${checkDigit}`;
    }

    private calculateChileanCheckDigit(run: string): string {
        // Simplified check digit calculation for Chilean RUN
        const weights = [2, 3, 4, 5, 6, 7, 2, 3];
        let sum = 0;
        
        for (let i = 0; i < 8; i++) {
            sum += parseInt(run[i]) * weights[i];
        }
        
        const remainder = sum % 11;
        const checkDigit = 11 - remainder;
        
        if (checkDigit === 11) return '0';
        if (checkDigit === 10) return 'K';
        return checkDigit.toString();
    }

    private generateArgentineCUIT(): string {
        // Generate a realistic Argentine CUIT (XX-XXXXXXXX-X)
        const cuit = faker.string.numeric(10);
        const checkDigit = this.calculateArgentineCheckDigit(cuit);
        return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${checkDigit}`;
    }

    private calculateArgentineCheckDigit(cuit: string): string {
        // Simplified check digit calculation for Argentine CUIT
        const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cuit[i]) * weights[i];
        }
        
        const remainder = sum % 11;
        const checkDigit = 11 - remainder;
        
        if (checkDigit === 11) return '0';
        if (checkDigit === 10) return '9';
        return checkDigit.toString();
    }

    private generateUSSSN(): string {
        // Generate a realistic US SSN (XXX-XX-XXXX)
        const ssn = faker.string.numeric(9);
        return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
    }

    private generateBrazilianCPF(): string {
        // Generate a realistic Brazilian CPF (XXX.XXX.XXX-XX)
        const cpf = faker.string.numeric(11);
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    }
} 