"use client";

import React, { useEffect, useMemo, useState } from 'react';
import DashboardContent from './DashboardContent';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Loader2, MessageSquare } from 'lucide-react';
import { runSqlChat, runListAgent } from '@/src/utils/api';
import { getCurrentUser } from '@/src/utils/sessionManager';

type RowObject = Record<string, any>;

interface MessageItem {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function AIChatDashboard() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState<RowObject[]>([]);
    const user = useMemo(() => getCurrentUser(), []);

    // No initial fetch; chat drives results now

    const appendMessage = (msg: MessageItem) => setMessages(prev => [...prev, msg]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;
        const text = input.trim();
        setInput('');
        appendMessage({ role: 'user', content: text });
        setIsLoading(true);
        try {
            // First try list agent
            const agent = await runListAgent(user.id, text);
            if (agent?.success && agent?.handled) {
                appendMessage({ role: 'assistant', content: agent.message || 'Done.' });
                if (Array.isArray(agent.rows)) setRows(agent.rows);
            } else {
                // Fallback to SQL chat
                const result = await runSqlChat(text);
                if (!result.success) {
                    appendMessage({ role: 'assistant', content: result.message || 'Something went wrong' });
                } else {
                    const count = result.rowCount ?? (Array.isArray(result.rows) ? result.rows.length : 0);
                    appendMessage({ role: 'assistant', content: `SQL: ${result.sql}\nReturned: ${count} row(s) in ${result.timeMs} ms` });
                    setRows(Array.isArray(result.rows) ? result.rows : []);
                }
            }
        } catch (e) {
            appendMessage({ role: 'assistant', content: 'Network error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardContent
            title="AI Chat"
            subtitle="Ask AI to list, add, edit, or delete your contacts. Examples: 'List contacts', 'Add Sarah with number 5551234', 'Edit John phone to 202-555-0123', 'Delete contact Jane'.">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 items-start">
                <div className="flex flex-col rounded-md border border-border bg-card lg:sticky lg:top-0 max-h-[80vh]">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-semibold">Conversation</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((m, idx) => (
                            <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                                <div className={`inline-block px-3 py-2 rounded-md text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                                    <pre className="whitespace-pre-wrap break-words">{m.content}</pre>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-foreground text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-border flex gap-2">
                        <Input
                            placeholder="Type an instruction..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>Send</Button>
                    </div>
                </div>

                <div className="rounded-md border border-border bg-card max-h-[80vh] flex flex-col">
                    <div className="px-4 py-3 border-b border-border font-semibold">Results</div>
                    <div className="p-4 overflow-x-auto overflow-y-auto flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {(rows[0] ? Object.keys(rows[0]) : ['']).map((k, idx) => (
                                        <TableHead key={idx}>{k}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((r, idx) => (
                                    <TableRow key={idx}>
                                        {(rows[0] ? Object.keys(rows[0]) : []).map((k) => (
                                            <TableCell key={k}>{String(r[k] ?? '')}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {rows.length === 0 && (
                            <div className="text-sm text-muted-foreground">No results yet. Ask something like: "show last 10 contacts names and emails"</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardContent>
    );
}


