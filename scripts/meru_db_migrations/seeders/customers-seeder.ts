import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient, DocumentType } from '@prisma/client';
import { InfoGenerator } from "../info-generator";

import { getRandomEnumValue } from "./shared/utils";

export class CustomersSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveCustomers(users: any[]) {
        try {
            // Generate customer data for each user
            const customers = [];
            const now = new Date().toISOString();
            
            for (const user of users) {
                // Generate customer data
                const customer = {
                    id: uuidv4(),
                    userId: user.id,
                    documentType: getRandomEnumValue(DocumentType),
                    documentNumber: InfoGenerator.key().substring(0, 20), // Generate document number
                    documentExpirationDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000), // Random future date
                    documentExpeditionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random past date
                    firstName: InfoGenerator.generateFirstName(),
                    middleName: Math.random() > 0.5 ? InfoGenerator.generateFirstName() : null, // 50% chance of having middle name
                    lastName: InfoGenerator.generateLastName(),
                    address: faker.location.streetAddress(),
                    secondLastName: Math.random() > 0.7 ? InfoGenerator.generateLastName() : null, // 30% chance of having second last name
                    createdAt: new Date(now),
                    updatedAt: new Date(now),
                    city: faker.location.city(),
                    dateOfBirth: new Date(Date.now() - Math.random() * 50 * 365 * 24 * 60 * 60 * 1000) // Random date within last 50 years
                };
                
                customers.push(customer);
            }
            
            // Save to database using createMany
            await this.prisma.customer.createMany({
                data: customers,
                skipDuplicates: true
            });
            
            return customers;
        } catch (error) {
            console.error('Error generating and saving customers:', error);
            throw error;
        }
    }
} 