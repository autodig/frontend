import { Contact } from "@/interfaces/contactInterface";

interface ContactTableProps {
  contacts: Contact[];
}


export default function ContactTable({ contacts }: ContactTableProps) {
  if (contacts.length === 0) return null;

  return (
    <div className="w-full mt-8 h-[800px] overflow-y-auto" >
      <h2 className="text-2xl font-bold mb-4">Processed Call Records</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="p-2 text-left">First Name</th>
              <th className="p-2 text-left">Last Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Zip</th>

            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b">
                <td className="p-2">{contact.first_name}</td>
                <td className="p-2">{contact.last_name}</td>
                <td className="p-2">{contact.addresses__city__is_primary}</td>
                <td className="p-2">{contact.addresses__zip__is_primary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
