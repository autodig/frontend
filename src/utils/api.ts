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

export async function runListAgent(userId: string, message: string) {
    try {
        const response = await fetch(`${backendBaseUrl}/chat/agent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, message }),
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to run list agent:', error);
        return { success: false, message: 'Network error' };
    }
}

// Call lists API
export async function createCallList(userId: string, name: string, description?: string) {
    const res = await fetch(`${backendBaseUrl}/lists`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, description }),
    });
    return res.json();
}

export async function getUserCallLists(userId: string) {
    const res = await fetch(`${backendBaseUrl}/lists/${userId}`);
    return res.json();
}

export async function deleteCallList(listId: string) {
    const res = await fetch(`${backendBaseUrl}/lists/${listId}`, { method: 'DELETE' });
    return res.json();
}

export async function getCallListItems(listId: string) {
    const res = await fetch(`${backendBaseUrl}/lists/${listId}/items`);
    return res.json();
}

export async function addContactsToCallList(listId: string, contactIds: string[]) {
    const res = await fetch(`${backendBaseUrl}/lists/${listId}/items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactIds }),
    });
    return res.json();
}

export async function removeContactFromCallList(listId: string, contactId: string) {
    const res = await fetch(`${backendBaseUrl}/lists/${listId}/items/${contactId}`, { method: 'DELETE' });
    return res.json();
}
