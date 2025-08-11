"use client";

import React, { useEffect, useMemo, useState } from 'react';
import DashboardContent from './DashboardContent';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { getCurrentUser } from '@/src/utils/sessionManager';
import { addContactsToCallList, createCallList, deleteCallList, fetchUserContacts, getCallListItems, getUserCallLists, removeContactFromCallList } from '@/src/utils/api';

interface CallList { id: string; user_id: string; name: string; description?: string | null; created_at: string; }
interface ListItem { id: string; contact?: { id: string; first_name: string; last_name: string; email: string | null; phone: string | null; status: string } }

export default function CallListsDashboard() {
    const user = useMemo(() => getCurrentUser(), []);
    const [lists, setLists] = useState<CallList[]>([]);
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [items, setItems] = useState<ListItem[]>([]);
    const [newListName, setNewListName] = useState('');
    const [newListDesc, setNewListDesc] = useState('');
    const [selectedContactIdsInput, setSelectedContactIdsInput] = useState('');
    const [allContacts, setAllContacts] = useState<any[]>([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'members'>('all');
    const [selectedForAdd, setSelectedForAdd] = useState<Set<string>>(new Set());
    const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set(['name', 'email', 'phone', 'city']));

    const loadLists = async () => {
        if (!user) return;
        const res = await getUserCallLists(user.id);
        if (res?.success) {
            const data = res.data || [];
            setLists(data);
            if (!activeListId && data.length) setActiveListId(data[0].id);
        }
    };

    const loadItems = async (listId: string) => {
        const res = await getCallListItems(listId);
        if (res?.success) setItems(res.data || []);
    };

    useEffect(() => { loadLists(); }, [user]);
    useEffect(() => {
        const loadContacts = async () => {
            if (!user) return;
            setContactsLoading(true);
            try {
                const res = await fetchUserContacts(user.id);
                if (res?.success) setAllContacts(res.data || []);
            } finally {
                setContactsLoading(false);
            }
        };
        loadContacts();
    }, [user]);
    useEffect(() => { if (activeListId) loadItems(activeListId); }, [activeListId]);

    const handleCreateList = async () => {
        if (!user || !newListName.trim()) return;
        const res = await createCallList(user.id, newListName.trim(), newListDesc.trim() || undefined);
        if (res?.success) {
            setNewListName(''); setNewListDesc('');
            await loadLists();
        }
    };

    const handleDeleteList = async (listId: string) => {
        const res = await deleteCallList(listId);
        if (res?.success) {
            if (activeListId === listId) { setActiveListId(null); setItems([]); }
            await loadLists();
        }
    };

    const handleAddContacts = async () => {
        if (!activeListId) return;
        const manualIds = selectedContactIdsInput.split(',').map(s => s.trim()).filter(Boolean);
        const ids = Array.from(new Set([...Array.from(selectedForAdd), ...manualIds]));
        if (ids.length === 0) return;
        const res = await addContactsToCallList(activeListId, ids);
        if (res?.success) { setSelectedContactIdsInput(''); setSelectedForAdd(new Set()); await loadItems(activeListId); }
    };

    const handleRemoveContact = async (contactId: string) => {
        if (!activeListId) return;
        const res = await removeContactFromCallList(activeListId, contactId);
        if (res?.success) await loadItems(activeListId);
    };

    return (
        <DashboardContent title="Call Time Lists" subtitle="Create lists and add/remove contacts. Use AI Chat to control lists too.">
            <div className="p-6 space-y-4">
                {/* Top bar: list selector + create/delete */}
                <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-sm text-muted-foreground">Active list:</span>
                        <select
                            className="flex-1 md:flex-none min-w-[220px] p-2 rounded-md border bg-background"
                            value={activeListId ?? ''}
                            onChange={(e) => setActiveListId(e.target.value || null)}
                        >
                            {lists.length === 0 && <option value="">No lists yet</option>}
                            {lists.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                        {activeListId && (
                            <Button variant="destructive" onClick={() => handleDeleteList(activeListId)}>Delete</Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Input placeholder="New list name" value={newListName} onChange={(e) => setNewListName(e.target.value)} className="max-w-xs" />
                        <Input placeholder="Description (optional)" value={newListDesc} onChange={(e) => setNewListDesc(e.target.value)} className="max-w-xs" />
                        <Button onClick={handleCreateList} disabled={!newListName.trim()}>Create</Button>
                    </div>
                </div>

                {/* Contacts area */}
                <div className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <button className={`px-3 py-1 rounded-md text-sm ${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} onClick={() => setActiveTab('all')}>All Contacts</button>
                        <button className={`px-3 py-1 rounded-md text-sm ${activeTab === 'members' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} onClick={() => setActiveTab('members')}>List Members</button>
                        <div className="ml-auto flex gap-2 items-center">
                            {activeListId && (
                                <>
                                    <Input placeholder="Contact IDs comma-separated" value={selectedContactIdsInput} onChange={(e) => setSelectedContactIdsInput(e.target.value)} />
                                    <Button onClick={handleAddContacts} disabled={!selectedContactIdsInput.trim() && selectedForAdd.size === 0}>Add Selected</Button>
                                </>
                            )}
                        </div>
                    </div>

                    {activeTab === 'all' ? (
                        <>
                            <div className="flex flex-col gap-3 mb-2 lg:flex-row lg:items-center lg:justify-between">
                                <div className="font-semibold">All Contacts {contactsLoading ? '(loading...)' : ''}</div>
                                <div className="flex-1 flex flex-wrap gap-3 items-center">
                                    <Input placeholder="Search name, email, phone, employer, state, city" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
                                    <div className="flex gap-3 items-center text-sm">
                                        <span className="text-muted-foreground">Fields:</span>
                                        {[
                                            { key: 'name', label: 'Name' },
                                            { key: 'email', label: 'Email' },
                                            { key: 'phone', label: 'Phone' },
                                            { key: 'city', label: 'City' },
                                            { key: 'state', label: 'State' },
                                            { key: 'employer', label: 'Employer' },
                                        ].map(f => (
                                            <label key={f.key} className="inline-flex items-center gap-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5"
                                                    checked={visibleFields.has(f.key)}
                                                    onChange={(e) => {
                                                        const next = new Set(visibleFields);
                                                        if (e.target.checked) next.add(f.key); else next.delete(f.key);
                                                        setVisibleFields(next);
                                                    }}
                                                />
                                                <span>{f.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-md border overflow-hidden">
                                <div className="max-h-[60vh] overflow-y-auto">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                                            <TableRow>
                                                <TableHead className="w-[70px]">Select</TableHead>
                                                {visibleFields.has('name') && <TableHead>Name</TableHead>}
                                                {visibleFields.has('email') && <TableHead>Email</TableHead>}
                                                {visibleFields.has('phone') && <TableHead>Phone</TableHead>}
                                                {visibleFields.has('city') && <TableHead>City</TableHead>}
                                                {visibleFields.has('state') && <TableHead>State</TableHead>}
                                                {visibleFields.has('employer') && <TableHead>Employer</TableHead>}
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allContacts
                                                .filter((c) => {
                                                    if (!search.trim()) return true;
                                                    const s = search.toLowerCase();
                                                    const vals = [c.first_name, c.last_name, c.email, c.phone, c.city, c.state, c.employer].map((v: string) => String(v || '').toLowerCase());
                                                    return vals.some(v => v.includes(s));
                                                })
                                                .map((c, idx) => {
                                                    const id = c.id as string;
                                                    const checked = selectedForAdd.has(id);
                                                    return (
                                                        <TableRow key={id} className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'} hover:bg-muted/50 transition-colors`}>
                                                            <TableCell>
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-muted-foreground/30"
                                                                    checked={checked}
                                                                    onChange={(e) => {
                                                                        const next = new Set(selectedForAdd);
                                                                        if (e.target.checked) next.add(id); else next.delete(id);
                                                                        setSelectedForAdd(next);
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            {visibleFields.has('name') && <TableCell className="font-medium">{c.first_name} {c.last_name}</TableCell>}
                                                            {visibleFields.has('email') && <TableCell className="text-muted-foreground">{c.email}</TableCell>}
                                                            {visibleFields.has('phone') && <TableCell className="text-muted-foreground">{c.phone}</TableCell>}
                                                            {visibleFields.has('city') && <TableCell>{c.city}</TableCell>}
                                                            {visibleFields.has('state') && (
                                                                <TableCell>
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-foreground">{c.state}</span>
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.has('employer') && <TableCell>{c.employer}</TableCell>}
                                                            <TableCell className="text-right">
                                                                <Button size="sm" disabled={!activeListId} onClick={async () => { await addContactsToCallList(activeListId!, [id]); await loadItems(activeListId!); }}>Add</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="font-semibold mb-2">List Members {activeListId ? '' : '(select a list)'}</div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map(it => (
                                        <TableRow key={it.id}>
                                            <TableCell>{it.contact ? `${it.contact.first_name} ${it.contact.last_name}` : ''}</TableCell>
                                            <TableCell>{it.contact?.email || ''}</TableCell>
                                            <TableCell>{it.contact?.phone || ''}</TableCell>
                                            <TableCell>{it.contact?.status || ''}</TableCell>
                                            <TableCell><Button variant="destructive" onClick={() => it.contact && handleRemoveContact(it.contact.id)}>Remove</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </div>
            </div>
        </DashboardContent>
    );
}


