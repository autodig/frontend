import { Contact } from "@/interfaces/contactInterface";
import { useEffect, useState } from "react";
import React from "react";
import { FECPersonalData } from "@/interfaces";

interface ContactTableProps {
  contacts: Contact[];
}

interface TransactionRowProps {
  transaction: any;
}

function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <tr className="border-b">
      <td className="p-2 font-medium">
        ${transaction.TRANSACTION_AMT.toLocaleString()}
      </td>
      <td className="p-2">
        {new Date(transaction.TRANSACTION_DT).toLocaleDateString()}
      </td>
      <td className="p-2">{transaction.TRANSACTION_TP}</td>
      <td className="p-2">{transaction.CMTE_NM}</td>
      <td className="p-2">{transaction.FILE_NUM}</td>
    </tr>
  );
}

interface TransactionTableProps {
  data: any;
  onSmartConnection: (donorId: string) => Promise<FECPersonalData[]>;
}

function TransactionTable({ data, onSmartConnection }: TransactionTableProps) {
  const [smartConnectionData, setSmartConnectionData] = useState<FECPersonalData[]>([]);

  const handleSmartConnectionClick = async (donorId: string) => {
    const data = await onSmartConnection(donorId);
    setSmartConnectionData(data);
  };



  return (
    <div className="mb-4">
      <p className="text-lg font-semibold mb-2">
        Donor ID: {data.donor_identifier}
        <button
          onClick={() => handleSmartConnectionClick(data.donor_identifier)}
          className="ml-4 font-bold text-xs px-1 py-1 border border-autodigPrimary text-white rounded hover:bg-autodigPrimary/80"
        >
          SMART CONNECTION
        </button>
      </p>

      {smartConnectionData && smartConnectionData.length > 0 ? (
        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Smart Connection Data</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Employer</th>
                <th className="p-2 text-left">Occupation</th>
              </tr>
            </thead>
            <tbody>
              {smartConnectionData.map((connection, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{connection.name}</td>
                  <td className="p-2">{connection.city}, {connection.state} {connection.zip_code}</td>
                  <td className="p-2">{connection.employer}</td>
                  <td className="p-2">{connection.occupation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Committee ID</th>
              <th className="p-2 text-left">File Number</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((transaction: any, idx: number) => (
              <TransactionRow key={idx} transaction={transaction} />
            ))}
          </tbody>
        </table>
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
  return (
    <React.Fragment>
      <tr className="border-b border-autodigPrimary">
        <td className="p-2">{contact.first_name}</td>
        <td className="p-2">{contact.last_name}</td>
        <td className="p-2">{contact.addresses__city__is_primary}</td>
        <td className="p-2">{contact.addresses__zip__is_primary}</td>
        <td className="p-2">
          <button
            onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)}
            className="px-4 py-2 text-white rounded border border-autodigPrimary"
          >
            {expandedContact === contact.id ? "Hide Transactions" : "Show Transactions"}
          </button>
        </td>
      </tr>
      {expandedContact === contact.id && contact.fecTransactionsData && (
        <tr className="border-rounded border border-autodigPrimary">
          <td colSpan={5} className="p-4">
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
    </React.Fragment>
  );
}

export default function ContactTable({ contacts }: ContactTableProps) {
  if (contacts.length === 0) return null;

  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const handleSmartConnection = async (donorId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/potential-connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donorId }),
      });
      const data = await response.json();
      return data;
      console.log('Potential connections response:', data);
    } catch (error) {
      console.error('Error fetching potential connections:', error);
    }
  };

  return (
    <div className="w-full mt-8 h-[800px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Processed Call Records</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="p-2 text-left">First Name</th>
              <th className="p-2 text-left">Last Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Zip</th>
              <th className="p-2 text-left">Actions</th>
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