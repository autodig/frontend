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

export async function interpretMessage(message: string): Promise<ContactCommand | null> {
    try {
        const res = await fetch('http://localhost:8000/chat/interpret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        return await res.json();
    } catch (err) {
        console.error('Failed to interpret message:', err);
        return null;
    }
}
