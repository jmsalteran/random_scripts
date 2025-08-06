import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export class DevicesSeeder {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateAndSaveDevices(users: any[]) {
        try {
            
            const devices = [];
            
            for (const user of users) {
                // Generate a unique FCM token for each device
                const fcmToken = this.generateFCMToken();
                
                const device = {
                    id: uuidv4(),
                    userId: user.id,
                    fcmToken: fcmToken
                };
                
                devices.push(device);
            }

            // Save devices to database
            const savedDevices = await this.prisma.device.createMany({
                data: devices,
                skipDuplicates: true
            });

            return devices;
        } catch (error) {
            console.error('Error generating and saving devices:', error);
            throw error;
        }
    }

    private generateFCMToken(): string {
        // Generate a realistic FCM token format
        // FCM tokens are typically 140+ characters long and contain alphanumeric characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        
        // Generate a token between 140-160 characters
        const length = Math.floor(Math.random() * 21) + 140;
        
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return token;
    }

    async checkDevices(devices: any[]) {
        try {
            
            const deviceCount = await this.prisma.device.count();
            
            // Verify that each user has exactly one device
            const usersWithDevices = await this.prisma.user.findMany({
                include: {
                    devices: true
                }
            });

            const usersWithMultipleDevices = usersWithDevices.filter(user => user.devices.length > 1);
            const usersWithoutDevices = usersWithDevices.filter(user => user.devices.length === 0);


            if (usersWithMultipleDevices.length > 0) {
                console.warn('Warning: Some users have multiple devices');
            }

            if (usersWithoutDevices.length > 0) {
                console.warn('Warning: Some users have no devices');
            }

            return devices;
        } catch (error) {
            console.error('Error checking devices:', error);
            throw error;
        }
    }
} 