import { Contact } from "@/interfaces/contactInterface";

interface ContactTableProps {
  contacts: Contact[];
}


export default function ContactTable({ contacts }: ContactTableProps) {
  if (contacts.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Processed Call Records</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Contact Name</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Result</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Notes</th>
              <th className="p-2 text-left">Zip</th>

            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b">
                <td className="p-2">{`${contact.first_name} ${contact.last_name}`}</td>
                <td className="p-2">
                  {new Date(contact.created_at).toLocaleDateString()}
                </td>
                <td className="p-2">{contact["All Emails"]}</td>
                <td className="p-2">${contact["All Phones"]}</td>
                <td className="p-2">{contact["All Addresses"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
