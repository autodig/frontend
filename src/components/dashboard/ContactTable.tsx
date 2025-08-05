import { Contact } from "@/src/interfaces/contactInterface";
import { useEffect, useState } from "react";
import React from "react";
import { FECPersonalData } from "@/src/interfaces";
import { ChevronDown, ChevronUp, XCircle } from "lucide-react"; // Import icons

interface ContactTableProps {
  contacts: Contact[];
}

interface TransactionRowProps {
  transaction: any;
}

function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium text-foreground">
        ${transaction.TRANSACTION_AMT.toLocaleString()}
      </td>
      <td className="p-3 text-muted-foreground">
        {new Date(transaction.TRANSACTION_DT).toLocaleDateString()}
      </td>
      <td className="p-3 text-muted-foreground">{transaction.TRANSACTION_TP}</td>
      <td className="p-3 text-muted-foreground">{transaction.CMTE_NM}</td>
      <td className="p-3 text-muted-foreground">{transaction.FILE_NUM}</td>
    </tr>
  );
}

interface TransactionTableProps {
  data: any;
  onSmartConnection: (donorId: string) => Promise<FECPersonalData[]>;
}

function TransactionTable({ data, onSmartConnection }: TransactionTableProps) {
  const [smartConnectionData, setSmartConnectionData] = useState<FECPersonalData[]>([]);
  const [showSmartConnection, setShowSmartConnection] = useState(false);
  const [isLoadingSmartConnection, setIsLoadingSmartConnection] = useState(false);
  const [smartConnectionError, setSmartConnectionError] = useState<string | null>(null);

  const handleSmartConnectionClick = async (donorId: string) => {
    setIsLoadingSmartConnection(true);
    setSmartConnectionError(null);
    try {
      const result = await onSmartConnection(donorId);
      setSmartConnectionData(result);
      setShowSmartConnection(true);
    } catch (error: any) {
      console.error('Error fetching smart connections:', error);
      setSmartConnectionError(error.message || "Failed to fetch AI recommendations.");
    } finally {
      setIsLoadingSmartConnection(false);
    }
  };

  return (
    <div className="mb-6 p-4 border border-border rounded-lg bg-background shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-semibold text-foreground">
          Donor ID: {data.donor_identifier}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSmartConnectionClick(data.donor_identifier)}
            className="flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-autodigBlue rounded-md
                       hover:bg-autodigBlue/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoadingSmartConnection}
          >
            {isLoadingSmartConnection ? "Loading AI..." : "AI RECOMMENDATIONS"}
          </button>
          {smartConnectionData.length > 0 && (
            <button
              onClick={() => setShowSmartConnection(!showSmartConnection)}
              className="flex items-center px-3 py-1.5 text-xs font-semibold text-autodigPrimary bg-background border border-autodigPrimary rounded-md
                         hover:bg-autodigPrimary/10 transition-colors duration-200"
            >
              {showSmartConnection ? "Show Transactions" : "Show AI Recommendations"}
              {showSmartConnection ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      {smartConnectionError && (
        <div className="flex items-center text-destructive text-sm mb-4">
          <XCircle className="h-4 w-4 mr-2" />
          {smartConnectionError}
        </div>
      )}

      {showSmartConnection && smartConnectionData.length > 0 ? (
        <div className="p-4 bg-muted/20 rounded-lg">
          <h3 className="font-bold text-lg text-foreground mb-3">AI Recommendations</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted text-muted-foreground rounded-t-lg">
                  <th className="p-3 text-left text-sm font-semibold">Name</th>
                  <th className="p-3 text-left text-sm font-semibold">Location</th>
                  <th className="p-3 text-left text-sm font-semibold">Employer</th>
                  <th className="p-3 text-left text-sm font-semibold">Occupation</th>
                  <th className="p-3 text-left text-sm font-semibold">Total Donations</th>
                </tr>
              </thead>
              <tbody>
                {smartConnectionData.map((connection, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-sm text-foreground">{connection.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {connection.city}, {connection.state} {connection.zip_code}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{connection.employer}</td>
                    <td className="p-3 text-sm text-muted-foreground">{connection.occupation}</td>
                    <td className="p-3 text-sm text-autodigPrimary font-semibold">
                      ${connection.total_previous_donations?.toLocaleString() || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground rounded-t-lg">
                <th className="p-3 text-left text-sm font-semibold">Amount</th>
                <th className="p-3 text-left text-sm font-semibold">Date</th>
                <th className="p-3 text-left text-sm font-semibold">Type</th>
                <th className="p-3 text-left text-sm font-semibold">Committee Name</th>
                <th className="p-3 text-left text-sm font-semibold">File Number</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((transaction: any, idx: number) => (
                <TransactionRow key={idx} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface ContactRowProps {
  contact: Contact;
  expandedContact: string | null;
  setExpandedContact: (id: string | null) => void;
  onSmartConnection: (donorId: string) => Promise<FECPersonalData[]>;
}

function ContactRow({ contact, expandedContact, setExpandedContact, onSmartConnection }: ContactRowProps) {
  const isExpanded = expandedContact === contact.id;

  return (
    <React.Fragment>
      <tr
        className={`border-b border-border cursor-pointer hover:bg-muted/30 transition-colors
          ${isExpanded ? "bg-muted/50" : ""}`}
        onClick={() => setExpandedContact(isExpanded ? null : contact.id)}
      >
        <td className="p-3 text-foreground font-medium">{contact.first_name}</td>
        <td className="p-3 text-foreground font-medium">{contact.last_name}</td>
        <td className="p-3 text-muted-foreground">
          {contact.addresses__city__is_primary}, {contact.addresses__state__is_primary}
        </td>
        <td className="p-3 text-muted-foreground">{contact.addresses__zip__is_primary}</td>
        <td className="p-3">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click from toggling expansion
              setExpandedContact(isExpanded ? null : contact.id);
            }}
            className="flex items-center px-4 py-2 text-sm text-autodigPrimary rounded-md border border-autodigPrimary bg-background
                       hover:bg-autodigPrimary hover:text-white transition-colors duration-200"
          >
            {isExpanded ? "Hide Details" : "View Details"}
            {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </button>
        </td>
      </tr>
      {isExpanded && contact.fecTransactionsData && contact.fecTransactionsData.length > 0 && (
        <tr>
          <td colSpan={5} className="p-4 bg-card border-t border-border">
            {contact.fecTransactionsData.map((data) => (
              <TransactionTable
                key={data.id}
                data={data}
                onSmartConnection={onSmartConnection}
              />
            ))}
          </td>
        </tr>
      )}
      {isExpanded && (!contact.fecTransactionsData || contact.fecTransactionsData.length === 0) && (
        <tr>
          <td colSpan={5} className="p-4 bg-card border-t border-border text-center text-muted-foreground">
            No FEC transaction data available for this contact.
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default function ContactTable({ contacts }: ContactTableProps) {
  if (!contacts || contacts.length === 0) return null;

  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const handleSmartConnection = async (donorId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL is not defined. Cannot fetch smart connections.");
      }
      const response = await fetch(`${backendUrl}/potential-connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donorId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch potential connections.");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching potential connections:', error);
      throw error; // Re-throw to be caught by TransactionTable
    }
  };

  return (
    <div className="w-full mt-8 p-6 bg-card rounded-xl shadow-lg border border-border">
      <h2 className="text-3xl font-extrabold text-foreground mb-6">Processed Call Records</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-sm">
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Zip</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                expandedContact={expandedContact}
                setExpandedContact={setExpandedContact}
                onSmartConnection={handleSmartConnection}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}