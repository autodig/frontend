'use client';

import { useEffect, useState } from 'react';
import { interpretMessage, ContactCommand } from '../../utils/api';

interface Contact {
    name: string;
    phone?: string;
    email?: string;
    tags?: string[];
}

export default function ChatBox() {
    const [input, setInput] = useState('');
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('contacts');
            if (saved) {
                setContacts(JSON.parse(saved));
            }
        }
    }, []);

    const updateLocalStorage = (newContacts: Contact[]) => {
        setContacts(newContacts);
        if (typeof window !== 'undefined') {
            localStorage.setItem('contacts', JSON.stringify(newContacts));
        }
    };

    const handleCommand = (command: ContactCommand) => {
        const { action, data } = command;
        let updated = [...contacts];

        if (action === 'add' && data?.name) {
            updated.push(data as Contact);
        } else if (action === 'delete' && data?.name) {
            updated = updated.filter(c => c.name.toLowerCase() !== data.name?.toLowerCase());
        } else if (action === 'edit' && data?.name) {
            updated = updated.map(c =>
                c.name.toLowerCase() === data.name?.toLowerCase() ? { ...c, ...data } : c
            );
        }

        updateLocalStorage(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const command = await interpretMessage(input);
        if (command && 'action' in command) {
            handleCommand(command);
        }

        setInput('');
    };

    return (
        <div className="p-4 w-full max-w-lg mx-auto">
            <ul className="mb-4 space-y-2">
                {contacts.map((c, i) => (
                    <li key={i}>
                        <strong>{c.name}</strong> — {c.phone} {c.email && `(${c.email})`}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Type a command..."
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Send
                </button>
            </form>
        </div>
    );
}
