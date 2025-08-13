import React, { useState, useEffect } from 'react';
import DashboardContent from './DashboardContent';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Search, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/src/utils/sessionManager';
import ContactDetail from './ContactDetail';

interface SavedContact {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: 'pending' | 'processing' | 'completed';
}

const ManageContactsDashboard: React.FC = () => {
    const [contacts, setContacts] = useState<SavedContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        const fetchContacts = async (reset = true) => {
            setIsLoading(true);
            setError(null);

            try {
                const user = getCurrentUser();
                if (!user) {
                    throw new Error("User not authenticated.");
                }

                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
                const response = await fetch(`${backendUrl}/contacts/${user.id}?limit=${pageSize}&offset=${reset ? 0 : offset}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch contacts: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    const newItems: SavedContact[] = result.data || [];
                    if (reset) {
                        setContacts(newItems);
                        setOffset(newItems.length);
                    } else {
                        setContacts(prev => [...prev, ...newItems]);
                        setOffset(prev => prev + newItems.length);
                    }
                    setHasMore(newItems.length === pageSize);
                    if (reset && newItems.length > 0) setSelectedId(newItems[0].id);
                } else {
                    throw new Error(result.message || "Failed to fetch contacts");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts(true);
    }, []);

    const loadMore = async () => {
        if (isFetchingMore || !hasMore) return;
        setIsFetchingMore(true);
        try {
            const user = getCurrentUser();
            if (!user) return;
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const response = await fetch(`${backendUrl}/contacts/${user.id}?limit=${pageSize}&offset=${offset}`);
            const result = await response.json();
            const newItems: SavedContact[] = result.data || [];
            setContacts(prev => [...prev, ...newItems]);
            setOffset(prev => prev + newItems.length);
            setHasMore(newItems.length === pageSize);
        } finally {
            setIsFetchingMore(false);
        }
    };

    return (
        <DashboardContent
            title="Manage Contacts"
            subtitle="Edit, view, or manage individual contact details."
        >
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-autodigPrimary" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-red-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 border rounded-lg overflow-hidden h-[70vh] flex flex-col">
                        <div className="p-3 border-b bg-muted/40">
                            <div className="relative">
                                <Input placeholder="Search contacts..." className="pl-10" />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <Table className="min-w-full">
                                <TableBody>
                                    {contacts.map((c) => (
                                        <TableRow key={c.id} className={`${selectedId === c.id ? 'bg-muted/60' : ''} cursor-pointer`} onClick={() => setSelectedId(c.id)}>
                                            <TableCell className="py-3">
                                                <div className="font-medium">{c.first_name} {c.last_name}</div>
                                                <div className="text-xs text-muted-foreground">{c.email || 'No email'}</div>
                                            </TableCell>
                                            <TableCell className="py-3 text-right text-xs">{c.status}</TableCell>
                                        </TableRow>
                                    ))}
                                    {hasMore && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center">
                                                <Button variant="outline" onClick={loadMore} disabled={isFetchingMore}>
                                                    {isFetchingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load more'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        {selectedId ? (
                            <ContactDetail contactId={selectedId} />
                        ) : (
                            <div className="h-[70vh] flex items-center justify-center text-muted-foreground">Select a contact to view details</div>
                        )}
                    </div>
                </div>
            )}
        </DashboardContent>
    );
};

export default ManageContactsDashboard;
