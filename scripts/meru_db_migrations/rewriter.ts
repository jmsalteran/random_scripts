import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface ColumnMapping {
    columnName: string;
    type: string;
    options?: Record<string, any>;
}

export class RewriteCsv {

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

    // Method to update specific columns with generated values
    static async updateColumnsWithGeneratedValues(
        csvFilePath: string, 
        columnMappings: ColumnMapping[]
    ) {
        // Read the CSV file
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const updatedLines = [lines[0]]; // Keep header
        
        // Process each row
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',');
            const updatedValues = [...values];
            
            // Update specific columns based on mappings
            for (const mapping of columnMappings) {
                const columnIndex = headers.indexOf(mapping.columnName);
                if (columnIndex !== -1) {
                    updatedValues[columnIndex] = this.generateValueByType(mapping.type, mapping.options);
                }
            }
            
            updatedLines.push(updatedValues.join(','));
        }
        
        // Write back to file
        fs.writeFileSync(csvFilePath, updatedLines.join('\n'));
        console.log(`Updated ${columnMappings.length} columns in ${lines.length - 1} rows`);
    }

    // Method to generate values based on type
    private static generateValueByType(type: string, options?: Record<string, any>): string {
        switch (type.toLowerCase()) {
            case 'uuid':
            case 'uuid4':
                return this.generateUuid4();
            case 'email':
                return this.generateEmail();
            case 'phone':
                return this.generatePhone();
            case 'name':
                return this.generateFullName();
            case 'publickey':
            case 'privatekey':
            case 'public_key':
                return this.key();
            default:
                return faker.string.alphanumeric(10);
        }
    }

    // Legacy method for backward compatibility
    static async forEachRowGenerateValues(csvFilePath: string, columnMappings: Record<string, string>) {
        const mappings: ColumnMapping[] = Object.entries(columnMappings).map(([columnName, type]) => ({
            columnName,
            type
        }));
        
        return this.updateColumnsWithGeneratedValues(csvFilePath, mappings);
    }

    static generateCsvWithGeneratedValues(csvFilePath: string, columnMappings: ColumnMapping[]) {
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const generatedRows: string[] = [];
        generatedRows.push(headers.join(','));

        // Let's generate 100 rows of random data
        for (let i = 0; i < 100; i++) {
            const row: string[] = [];
            for (let j = 0; j < headers.length; j++) {
                // Find if this column has a mapping
                const mapping = columnMappings.find(m => m.columnName === headers[j]);
                if (mapping) {
                    row.push(this.generateValueByType(mapping.type, mapping.options));
                } else {
                    // If not mapped, just put an empty string
                    row.push('');
                }
            }
            generatedRows.push(row.join(','));
        }

        fs.writeFileSync(csvFilePath, generatedRows.join('\n'));
        console.log(`Generated CSV with ${generatedRows.length - 1} rows and columns: ${headers.join(',')}`);
    }

}

