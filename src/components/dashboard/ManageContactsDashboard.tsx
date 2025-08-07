import React, { useState, useEffect } from 'react';
import DashboardContent from './DashboardContent';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Search, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/src/utils/sessionManager';

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

    useEffect(() => {
        const fetchContacts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const user = getCurrentUser();
                if (!user) {
                    throw new Error("User not authenticated.");
                }

                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
                const response = await fetch(`${backendUrl}/contacts/${user.id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch contacts: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setContacts(result.data || []);
                } else {
                    throw new Error(result.message || "Failed to fetch contacts");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, []);

    return (
        <DashboardContent
            title="Manage Contacts"
            subtitle="Edit, view, or manage individual contact details."
        >
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-1/3">
                    <Input placeholder="Search contacts..." className="pl-10" />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <Button className="flex items-center"><UserPlus className="h-5 w-5 mr-2" /> Add Contact</Button>
            </div>

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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map(contact => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.first_name} {contact.last_name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </DashboardContent>
    );
};

export default ManageContactsDashboard;
