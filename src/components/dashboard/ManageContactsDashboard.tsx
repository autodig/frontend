import React from 'react';
import DashboardContent from './DashboardContent';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Search, UserPlus } from 'lucide-react';

const ManageContactsDashboard: React.FC = () => {
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
                    <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john.doe@example.com</TableCell>
                        <TableCell>123-456-7890</TableCell>
                        <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>jane.smith@example.com</TableCell>
                        <TableCell>098-765-4321</TableCell>
                        <TableCell>Inactive</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </DashboardContent>
    );
};

export default ManageContactsDashboard;
