import { CallRecord } from "@/interfaces";

interface CallRecordsTableProps {
  records: CallRecord[];
}

export default function CallRecordsTable({ records }: CallRecordsTableProps) {
  if (records.length === 0) return null;

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
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="p-2">{`${record.first_name} ${record.last_name}`}</td>
                <td className="p-2">
                  {new Date(record.transacted_at).toLocaleDateString()}
                </td>
                <td className="p-2">{record.display_source_name}</td>
                <td className="p-2">${record.amount}</td>
                <td className="p-2">{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
