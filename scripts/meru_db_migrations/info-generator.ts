import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export interface ColumnMapping {
    columnName: string;
    type: string;
    options?: Record<string, any>;
}

export class InfoGenerator {

    static generateUuid4() {
        return uuidv4();
    }

    static generateEmail() {
        return faker.internet.email().toLowerCase();
    }

    static generatePhone() {
        return faker.phone.number();
    }

    static generateFullName() {
        return faker.person.fullName();
    }

    static generateFirstName() {
        return faker.person.firstName();
    }

    static generateLastName() {
        return faker.person.lastName();
    }

    static key() {
        // Generate a random hex string similar to a public key
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 128; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

}

