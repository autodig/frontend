import { Contact } from "@/interfaces/contactInterface";
import { useState } from "react";
import React from "react";

interface ContactTableProps {
  contacts: Contact[];
}

export default function ContactTable({ contacts }: ContactTableProps) {
  if (contacts.length === 0) return null;

  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  console.log(contacts[0].fecTransactionsData);
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
              <React.Fragment key={contact.id}>
                <tr className="border-b">
                  <td className="p-2">{contact.first_name}</td>
                  <td className="p-2">{contact.last_name}</td>
                  <td className="p-2">{contact.addresses__city__is_primary}</td>
                  <td className="p-2">{contact.addresses__zip__is_primary}</td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        setExpandedContact(
                          expandedContact === contact.id ? null : contact.id
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {expandedContact === contact.id
                        ? "Hide Transactions"
                        : "Show Transactions"}
                    </button>
                  </td>
                </tr>
                {expandedContact === contact.id &&
                  contact.fecTransactionsData && (
                    <tr>
                      <td colSpan={5} className="p-4">
                        {contact.fecTransactionsData.map((data) => (
                          <div key={data.id} className="mb-4">
                            <p className="text-lg font-semibold mb-2">
                              Donor ID: {data.donor_identifier}
                            </p>
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b">
                                  <th className="p-2 text-left">Amount</th>
                                  <th className="p-2 text-left">Date</th>
                                  <th className="p-2 text-left">Type</th>
                                  <th className="p-2 text-left">
                                    Committee ID
                                  </th>
                                  <th className="p-2 text-left">File Number</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.transactions.map((transaction, idx) => (
                                  <tr key={idx} className="border-b">
                                    <td className="p-2 font-medium">
                                      $
                                      {transaction.TRANSACTION_AMT.toLocaleString()}
                                    </td>
                                    <td className="p-2">
                                      {new Date(
                                        transaction.TRANSACTION_DT
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="p-2">
                                      {transaction.TRANSACTION_TP}
                                    </td>
                                    <td className="p-2">
                                      {transaction.CMTE_NM}
                                    </td>
                                    <td className="p-2">
                                      {transaction.FILE_NUM}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
