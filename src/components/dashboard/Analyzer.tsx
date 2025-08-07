import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
    RefreshCw,
    TrendingUp,
    Users,
    DollarSign,
    Loader2,
    AlertCircle,
    CheckCircle,
    Clock
} from "lucide-react";
import { getCurrentUser } from "@/src/utils/sessionManager";

interface SavedContact {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip_code: string;
    employer: string;
    occupation: string;
    party: string;
    created_at: string;
    status: 'pending' | 'processing' | 'completed';
    fec_data?: any;
}

export default function Analyzer() {
    const [contacts, setContacts] = useState<SavedContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const user = getCurrentUser();
            console.log("Current user:", user); // Debug log

            if (!user) {
                throw new Error("User not authenticated. Please try refreshing the page.");
            }

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            console.log("Backend URL:", backendUrl); // Debug log

            console.log("Fetching contacts for user:", user.id); // Debug log
            const response = await fetch(`${backendUrl}/contacts/${user.id}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Fetch error:", response.status, errorText);
                throw new Error(`Failed to fetch contacts: ${response.status}`);
            }

            const result = await response.json();
            console.log("Fetch result:", result); // Debug log

            if (result.success) {
                setContacts(result.data || []);
            } else {
                throw new Error(result.message || "Failed to fetch contacts");
            }
        } catch (err: any) {
            console.error("Error in fetchContacts:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const processContacts = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const user = getCurrentUser();
            if (!user) {
                throw new Error("User not authenticated");
            }

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

            // Call backend to process FEC data
            const response = await fetch(`${backendUrl}/contacts/${user.id}/process-fec`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to process FEC data");
            }

            const result = await response.json();
            if (result.success) {
                // Refresh contacts to get updated data
                await fetchContacts();
            } else {
                throw new Error(result.message || "Failed to process FEC data");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const pendingCount = contacts.filter(c => c.status === 'pending').length;
    const processingCount = contacts.filter(c => c.status === 'processing').length;
    const completedCount = contacts.filter(c => c.status === 'completed').length;

    const completedContacts = contacts.filter(c => c.status === 'completed' && c.fec_data);

    const getTotalDonations = (contact: SavedContact) => {
        if (!contact.fec_data || !contact.fec_data[0] || !contact.fec_data[0].transactions) {
            return 0;
        }
        return contact.fec_data[0].transactions.reduce((sum: number, t: any) => sum + (t.TRANSACTION_AMT || 0), 0);
    };

    const getDonationCount = (contact: SavedContact) => {
        if (!contact.fec_data || !contact.fec_data[0] || !contact.fec_data[0].transactions) {
            return 0;
        }
        return contact.fec_data[0].transactions.length;
    };

    const getCommittees = (contact: SavedContact) => {
        if (!contact.fec_data || !contact.fec_data[0] || !contact.fec_data[0].transactions) {
            return [];
        }
        const committeeNames = contact.fec_data[0].transactions.map((t: any) => t.CMTE_NM).filter(Boolean);
        return [...new Set(committeeNames)]; // Unique committee names
    };

    const totalDonations = completedContacts.reduce((sum, c) => sum + getTotalDonations(c), 0);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-autodigPrimary" />
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-card rounded-xl shadow-lg border border-border">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-foreground">Data Analyzer</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchContacts}
                        disabled={isLoading}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    {pendingCount > 0 && (
                        <Button
                            onClick={processContacts}
                            disabled={isProcessing}
                            className="bg-autodigPrimary hover:bg-autodigPrimary/90"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Process FEC Data
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Total Contacts</span>
                    </div>
                    <div className="text-2xl font-bold">{contacts.length}</div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Pending</span>
                    </div>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-muted-foreground">Completed</span>
                    </div>
                    <div className="text-2xl font-bold">{completedCount}</div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-muted-foreground">Total Donations</span>
                    </div>
                    <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
                </Card>
            </div>

            {/* Contacts List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Contact Analysis</h3>
                {contacts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No contacts found. Import some contacts first.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {contacts.map((contact) => (
                            <Card key={contact.id} className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold">
                                                {contact.first_name} {contact.last_name}
                                            </h4>
                                            <Badge
                                                variant={
                                                    contact.status === 'completed' ? 'default' :
                                                        contact.status === 'processing' ? 'secondary' : 'outline'
                                                }
                                                className={
                                                    contact.status === 'completed' ? 'bg-green-500' :
                                                        contact.status === 'processing' ? 'bg-yellow-500' : ''
                                                }
                                            >
                                                {contact.status}
                                            </Badge>
                                        </div>

                                        <div className="text-sm text-muted-foreground space-y-1">
                                            {contact.email && <div>📧 {contact.email}</div>}
                                            {contact.phone && <div>📞 {contact.phone}</div>}
                                            {contact.city && <div>📍 {contact.city}, {contact.state}</div>}
                                            {contact.employer && <div>💼 {contact.employer}</div>}
                                        </div>

                                        {contact.fec_data && (
                                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                                                    FEC Analysis Results
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Total Donations:</span>
                                                        <div className="font-semibold">${getTotalDonations(contact).toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Donation Count:</span>
                                                        <div className="font-semibold">{getDonationCount(contact)}</div>
                                                    </div>
                                                </div>
                                                {getCommittees(contact).length > 0 && (
                                                    <div className="mt-2">
                                                        <span className="text-muted-foreground text-sm">Committees:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {getCommittees(contact).map((committee: string, index: number) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {committee}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 