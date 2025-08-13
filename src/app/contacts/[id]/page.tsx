"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Loader2, Mail, Save, RefreshCw } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";

type UploadedContact = {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    employer: string | null;
    occupation: string | null;
    party: string | null;
    created_at: string;
    status: "pending" | "processing" | "completed";
    fec_data?: any;
};

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    const [contact, setContact] = useState<UploadedContact | null>(null);
    const [form, setForm] = useState<Partial<UploadedContact>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [summary, setSummary] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchRecipient, setSearchRecipient] = useState<string>("");
    const [interactions, setInteractions] = useState<Array<{ at: string; note: string }>>([]);
    const [newInteraction, setNewInteraction] = useState("");

    const fetchContact = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${backendUrl}/contact/${id}`);
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Failed to load contact");
            setContact(json.data);
            setForm(json.data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchContact();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Load interactions from localStorage for now (can be moved to backend later)
    useEffect(() => {
        if (!id || typeof window === 'undefined') return;
        const raw = localStorage.getItem(`contact:${id}:interactions`);
        if (raw) setInteractions(JSON.parse(raw));
    }, [id]);

    const persistInteractions = (items: Array<{ at: string; note: string }>) => {
        if (!id || typeof window === 'undefined') return;
        localStorage.setItem(`contact:${id}:interactions`, JSON.stringify(items));
    };

    const addInteraction = () => {
        if (!newInteraction.trim()) return;
        const items = [{ at: new Date().toISOString(), note: newInteraction.trim() }, ...interactions];
        setInteractions(items);
        setNewInteraction("");
        persistInteractions(items);
    };

    const save = async () => {
        if (!contact) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`${backendUrl}/contact/${contact.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    email: form.email,
                    phone: form.phone,
                    address_line_1: form.address_line_1,
                    address_line_2: form.address_line_2,
                    city: form.city,
                    state: form.state,
                    zip_code: form.zip_code,
                    employer: form.employer,
                    occupation: form.occupation,
                    party: form.party,
                }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Failed to save contact");
            setContact(json.data);
            setForm(json.data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const sendEmailHref = useMemo(() => {
        const to = form.email || contact?.email;
        if (!to) return undefined;
        const subject = encodeURIComponent(`Quick note`);
        const body = encodeURIComponent(`Hi ${[form.first_name || contact?.first_name, contact?.last_name].filter(Boolean).join(" ")},\n\n`);
        return `mailto:${to}?subject=${subject}&body=${body}`;
    }, [form.email, form.first_name, contact]);

    const summarize = async () => {
        if (!contact) return;
        setSummarizing(true);
        setError(null);
        try {
            const res = await fetch(`${backendUrl}/chat/summarize-person`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile: contact, fec_data: contact.fec_data }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Failed to generate summary");
            setSummary(json.summary || "");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSummarizing(false);
        }
    };

    // Compute transactions and aggregates unconditionally to keep Hook order stable
    const txns = contact?.fec_data?.[0]?.transactions || [];
    const filteredTxns = useMemo(() => {
        const sd = startDate ? new Date(startDate) : null;
        const ed = endDate ? new Date(endDate) : null;
        return txns.filter((t: any) => {
            const tDate = t.TRANSACTION_DT ? new Date(t.TRANSACTION_DT) : null;
            if (sd && tDate && tDate < sd) return false;
            if (ed && tDate && tDate > ed) return false;
            if (searchRecipient) {
                const hay = `${t.CMTE_NM || ''} ${t.CMTE_ID || ''}`.toLowerCase();
                if (!hay.includes(searchRecipient.toLowerCase())) return false;
            }
            return true;
        });
    }, [txns, startDate, endDate, searchRecipient]);

    const donationStats = useMemo(() => {
        const amounts = filteredTxns.map((t: any) => Number(t.TRANSACTION_AMT || 0));
        const total = amounts.reduce((a: number, b: number) => a + b, 0);
        const count = amounts.length;
        const avg = count ? Math.round(total / count) : 0;
        const max = amounts.length ? Math.max(...amounts) : 0;
        return { total, count, avg, max };
    }, [filteredTxns]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-red-500 mb-4">{error}</p>
                <Button variant="outline" onClick={() => fetchContact()}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Retry
                </Button>
            </div>
        );
    }

    if (!contact) return null;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {form.first_name || contact.first_name} {form.last_name || contact.last_name}
                </h1>
                <div className="flex gap-2">
                    {sendEmailHref && (
                        <a href={sendEmailHref} className="inline-flex">
                            <Button variant="default">
                                <Mail className="w-4 h-4 mr-2" /> Send Email
                            </Button>
                        </a>
                    )}
                    <Button onClick={save} disabled={saving} className="bg-autodigPrimary hover:bg-autodigPrimary/90">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4 space-y-4 md:col-span-1">
                    <h2 className="font-semibold">Contact Info</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <Label>First name</Label>
                            <Input value={form.first_name || ""} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Last name</Label>
                            <Input value={form.last_name || ""} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={form.email || ""} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input value={form.phone || ""} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Employer</Label>
                            <Input value={form.employer || ""} onChange={(e) => setForm((s) => ({ ...s, employer: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Occupation</Label>
                            <Input value={form.occupation || ""} onChange={(e) => setForm((s) => ({ ...s, occupation: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Address line 1</Label>
                            <Input value={form.address_line_1 || ""} onChange={(e) => setForm((s) => ({ ...s, address_line_1: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Address line 2</Label>
                            <Input value={form.address_line_2 || ""} onChange={(e) => setForm((s) => ({ ...s, address_line_2: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label>City</Label>
                                <Input value={form.city || ""} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />
                            </div>
                            <div>
                                <Label>State</Label>
                                <Input value={form.state || ""} onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))} />
                            </div>
                            <div>
                                <Label>Zip</Label>
                                <Input value={form.zip_code || ""} onChange={(e) => setForm((s) => ({ ...s, zip_code: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="p-4">
                        <h2 className="font-semibold mb-3">Interactions</h2>
                        <div className="space-y-3">
                            <Textarea
                                placeholder="Log an interaction (call, email, meeting, note)..."
                                value={newInteraction}
                                onChange={(e) => setNewInteraction(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button onClick={addInteraction} variant="outline">Add Interaction</Button>
                            </div>
                            {interactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No interactions yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {interactions.map((it, idx) => (
                                        <li key={idx} className="text-sm border rounded p-2">
                                            <div className="text-muted-foreground text-xs">{new Date(it.at).toLocaleString()}</div>
                                            <div className="text-foreground whitespace-pre-wrap">{it.note}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Giving History</h2>
                            <Button variant="outline" onClick={fetchContact}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                            </Button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 mt-4">
                            <div>
                                <Label>Start date</Label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div>
                                <Label>End date</Label>
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div>
                                <Label>Search recipient/committee</Label>
                                <Input placeholder="Committee name..." value={searchRecipient} onChange={(e) => setSearchRecipient(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground mt-3">
                            <div>Total: <span className="font-semibold text-foreground">${donationStats.total.toLocaleString()}</span></div>
                            <div>Avg: <span className="font-semibold text-foreground">${donationStats.avg.toLocaleString()}</span></div>
                            <div>Max: <span className="font-semibold text-foreground">${donationStats.max.toLocaleString()}</span></div>
                            <div>Count: <span className="font-semibold text-foreground">{donationStats.count}</span></div>
                        </div>
                        {txns.length === 0 ? (
                            <p className="text-sm text-muted-foreground mt-4">No FEC transactions found.</p>
                        ) : (
                            <div className="overflow-x-auto mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Committee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTxns.map((t: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell>{t.TRANSACTION_DT ? new Date(t.TRANSACTION_DT).toLocaleDateString() : ""}</TableCell>
                                                <TableCell>${(t.TRANSACTION_AMT || 0).toLocaleString()}</TableCell>
                                                <TableCell>{t.TRANSACTION_TP}</TableCell>
                                                <TableCell>{t.CMTE_NM}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold">AI Summary</h2>
                            <Button onClick={summarize} disabled={summarizing} className="bg-autodigPrimary hover:bg-autodigPrimary/90">
                                {summarizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Generate
                            </Button>
                        </div>
                        {summary ? (
                            <p className="text-sm whitespace-pre-wrap">{summary}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">Click Generate to produce a concise profile and giving summary.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}


