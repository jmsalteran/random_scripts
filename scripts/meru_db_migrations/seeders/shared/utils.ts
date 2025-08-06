// Helper function to get random enum value
export function getRandomEnumValue<T extends Record<string, string>>(enumObj: T): T[keyof T] {
    const values = Object.values(enumObj);
    return values[Math.floor(Math.random() * values.length)] as T[keyof T];
} 