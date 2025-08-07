import { useState } from "react";
import { Contact } from "@/src/interfaces/contactInterface";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";

interface ContactConfirmationProps {
    contacts: Contact[];
    onConfirm: (contacts: Contact[]) => void;
    onBack: () => void;
}

export default function ContactConfirmation({
    contacts,
    onConfirm,
    onBack
}: ContactConfirmationProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState<Set<number>>(
        new Set(contacts.map((_, index) => index))
    );

    const handleToggleContact = (index: number) => {
        const newSelected = new Set(selectedContacts);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedContacts(newSelected);
    };

    const handleSelectAll = () => {
        setSelectedContacts(new Set(contacts.map((_, index) => index)));
    };

    const handleDeselectAll = () => {
        setSelectedContacts(new Set());
    };

    const handleConfirm = async () => {
        if (selectedContacts.size === 0) {
            alert("Please select at least one contact to save.");
            return;
        }

        setIsSaving(true);
        try {
            const contactsToSave = contacts.filter((_, index) => selectedContacts.has(index));
            await onConfirm(contactsToSave);
        } catch (error) {
            console.error("Error saving contacts:", error);
            alert("Failed to save contacts. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const selectedCount = selectedContacts.size;
    const totalCount = contacts.length;

    return (
        <div className="w-full p-6 bg-card rounded-xl shadow-lg border border-border">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-foreground">
                    Confirm Contacts ({selectedCount}/{totalCount})
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={selectedContacts.size === totalCount}
                    >
                        Select All
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeselectAll}
                        disabled={selectedContacts.size === 0}
                    >
                        Deselect All
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                    Review and select the contacts you want to save. Any CSV format is supported - we'll automatically map common field names. You can select up to 100 contacts.
                </p>
                <div className="flex gap-4 text-sm">
                    <span className="text-green-600 font-medium">
                        ✓ {selectedCount} selected
                    </span>
                    <span className="text-muted-foreground">
                        {totalCount - selectedCount} unselected
                    </span>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 mb-6">
                {contacts.map((contact, index) => (
                    <Card
                        key={index}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedContacts.has(index)
                            ? "border-autodigPrimary bg-autodigPrimary/5"
                            : "border-border"
                            }`}
                        onClick={() => handleToggleContact(index)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedContacts.has(index)
                                        ? "bg-autodigPrimary border-autodigPrimary"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {selectedContacts.has(index) && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-foreground">
                                        {contact.first_name || (contact as any).firstName || (contact as any)['First Name'] || ''} {contact.last_name || (contact as any).lastName || (contact as any)['Last Name'] || ''}
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {(contact.emails__address__is_primary || (contact as any).email || (contact as any).Email) && (
                                            <div>📧 {contact.emails__address__is_primary || (contact as any).email || (contact as any).Email}</div>
                                        )}
                                        {(contact.phones__number__is_primary || (contact as any).phone || (contact as any).Phone) && (
                                            <div>📞 {contact.phones__number__is_primary || (contact as any).phone || (contact as any).Phone}</div>
                                        )}
                                        {(contact.addresses__city__is_primary || (contact as any).city || (contact as any).City) && (
                                            <div>
                                                📍 {contact.addresses__city__is_primary || (contact as any).city || (contact as any).City}, {contact.addresses__state__is_primary || (contact as any).state || (contact as any).State}
                                            </div>
                                        )}
                                        {(contact.employer || (contact as any).company || (contact as any).Company) && (
                                            <div>💼 {contact.employer || (contact as any).company || (contact as any).Company}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                #{index + 1}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isSaving}
                >
                    <X className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {selectedCount} contacts selected
                    </span>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedCount === 0 || isSaving}
                        className="bg-autodigPrimary hover:bg-autodigPrimary/90"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Save {selectedCount} Contacts
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
} 