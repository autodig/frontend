import React from 'react';
import DashboardContent from './DashboardContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { BarChart, LineChart, PieChart } from 'lucide-react';

const PerformanceDashboard: React.FC = () => {
    return (
        <DashboardContent
            title="Performance Tracking"
            subtitle="View your outreach performance metrics and insights here."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><BarChart className="h-5 w-5 mr-2" /> Call Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">75%</p>
                        <p className="text-sm text-muted-foreground">Based on the last 100 calls</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><LineChart className="h-5 w-5 mr-2" /> Donations Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">$5,400</p>
                        <p className="text-sm text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><PieChart className="h-5 w-5 mr-2" /> Contact Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">42%</p>
                        <p className="text-sm text-muted-foreground">From target demographic</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardContent>
    );
};

export default PerformanceDashboard;
