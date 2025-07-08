export interface SharedType {
    id: number;
    name: string;
    description?: string;
}

export type ScriptResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
};