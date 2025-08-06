import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import csv from 'csv-parser';

interface FieldInfo {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  enumValues?: string[];
}

interface ModelInfo {
  name: string;
  fields: FieldInfo[];
}

export class DatabaseWriter {
  private prisma: PrismaClient;
  private schemaPath: string;

  constructor(schemaPath: string = 'prisma/schema.prisma') {
    this.prisma = new PrismaClient();
    this.schemaPath = schemaPath;
  }

  private parsePrismaSchema(): { models: ModelInfo[], enums: Map<string, string[]> } {
    const schemaContent = fs.readFileSync(this.schemaPath, 'utf-8');
    const models: ModelInfo[] = [];
    const enums = new Map<string, string[]>();
    
    // Parse enums first
    const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
    let enumMatch;
    while ((enumMatch = enumRegex.exec(schemaContent)) !== null) {
      const enumName = enumMatch[1];
      const enumValues = enumMatch[2]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'))
        .map(line => line.replace(/\s*\/\/.*$/, '').trim());
      enums.set(enumName, enumValues);
    }

    // Parse models
    const modelRegex = /model\s+(\w+)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
    let modelMatch;
    while ((modelMatch = modelRegex.exec(schemaContent)) !== null) {
      const modelName = modelMatch[1];
      const modelContent = modelMatch[2];
      
      const fields: FieldInfo[] = [];
      const fieldLines = modelContent.split('\n');
      
      for (const line of fieldLines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('@@')) {
          continue;
        }
        
        const fieldMatch = trimmedLine.match(/^(\w+)\s+([^?]+)(\?)?(\[\])?/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          const fieldType = fieldMatch[2].trim();
          const isOptional = !!fieldMatch[3];
          const isArray = !!fieldMatch[4];
          
          fields.push({
            name: fieldName,
            type: fieldType,
            isOptional,
            isArray,
            enumValues: enums.get(fieldType)
          });
        }
      }
      
      models.push({ name: modelName, fields });
    }
    
    return { models, enums };
  }

  private getModelInfo(modelName: string): ModelInfo | null {
    const { models } = this.parsePrismaSchema();
    return models.find(model => model.name.toLowerCase() === modelName.toLowerCase()) || null;
  }

  private convertValue(value: string, fieldInfo: FieldInfo): any {
    if (value === '' || value === 'null' || value === null || value === undefined) {
      return fieldInfo.isOptional ? null : undefined;
    }

    switch (fieldInfo.type) {
      case 'Boolean':
        return value.toLowerCase() == 'true' || value == '1';
      
      case 'Int':
        return parseInt(value, 10);
      
      case 'Float':
      case 'Decimal':
        return parseFloat(value);
      
      case 'DateTime':
        return new Date(value);
      
      case 'String':
        return value;
      
      default:
        // Check if it's an enum
        if (fieldInfo.enumValues) {
          if (fieldInfo.enumValues.includes(value)) {
            return value;
          } else {
            console.warn(`Invalid enum value: ${value} for field ${fieldInfo.name}. Valid values: ${fieldInfo.enumValues.join(', ')}`);
            return fieldInfo.isOptional ? null : undefined;
          }
        }
        
        // Default to string for unknown types
        return value;
    }
  }

  async readCsvFile(filePath: string): Promise<any[]> {
    const results: any[] = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  async writeToDatabase(modelName: string, data: any[]): Promise<void> {
    try {
      const model = this.prisma[modelName as keyof PrismaClient] as any;
      
      if (!model || typeof model.createMany !== 'function') {
        throw new Error(`Invalid model: ${modelName}`);
      }

      const modelInfo = this.getModelInfo(modelName);
      if (!modelInfo) {
        throw new Error(`Model ${modelName} not found in schema`);
      }

      // Convert CSV data to match schema
      const processedData = data.map(row => {
        const processed: any = {};
        
        for (const fieldInfo of modelInfo.fields) {
          const csvValue = row[fieldInfo.name];
          const convertedValue = this.convertValue(csvValue, fieldInfo);
            processed[fieldInfo.name] = convertedValue;
        }
        
        return processed; // Return the processed object
      });

      await model.createMany({
        data: processedData,
        skipDuplicates: true
      });

      console.log(`Successfully wrote ${data.length} records to ${modelName}`);
    } catch (error) {
      console.error(`Error writing to ${modelName}:`, error);
      throw error;
    }
  }

  async processCsvFile(csvFilePath: string, modelName: string): Promise<void> {
    console.log(`Processing ${csvFilePath} for model ${modelName}`);
    
    const data = await this.readCsvFile(csvFilePath);
    console.log(`Read ${data.length} records from CSV`);
    
    await this.writeToDatabase(modelName, data);
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
