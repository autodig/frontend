// /src/utils/api.ts
export interface ContactCommand {
    action: 'add' | 'edit' | 'delete' | 'list';
    data?: {
        name?: string;
        phone?: string;
        email?: string;
        tags?: string[];
    };
}

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function interpretMessage(message: string): Promise<ContactCommand | null> {
    try {
        const response = await fetch(`${backendBaseUrl}/chat/interpret`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        return await response.json();
    } catch (err) {
        console.error('Failed to interpret message:', err);
        return null;
    }
}

export interface AICommandResult<T = any> {
    success: boolean;
    action?: ContactCommand['action'];
    data?: T;
    message?: string;
}

export async function executeAIContactCommand(userId: string, message: string): Promise<AICommandResult> {
    try {
        const response = await fetch(`${backendBaseUrl}/chat/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, message }),
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to execute AI contact command:', error);
        return { success: false, message: 'Network error' };
    }
}

export async function fetchUserContacts(userId: string) {
    const response = await fetch(`${backendBaseUrl}/contacts/${userId}`);
    return response.json();
}

export interface SqlChatResponse {
    success: boolean;
    sql?: string;
    rows?: any[];
    rowCount?: number;
    timeMs?: number;
    message?: string;
}

export async function runSqlChat(message: string): Promise<SqlChatResponse> {
    try {
        const response = await fetch(`${backendBaseUrl}/chat/sql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to run SQL chat:', error);
        return { success: false, message: 'Network error' };
    }
}
