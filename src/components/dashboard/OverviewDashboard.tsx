import React from 'react';
import DashboardContent from './DashboardContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react';

const OverviewDashboard: React.FC = () => {
    return (
        <DashboardContent
            title="Dashboard Overview"
            subtitle="Welcome to your AutoDig Dashboard! Here's a summary of your activities."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,250</div>
                        <p className="text-xs text-muted-foreground">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">Improvement from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$15,231.89</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">New contact list imported</p>
                            <p className="text-sm text-muted-foreground">5 minutes ago</p>
                        </div>
                        <Button variant="outline" size="sm">View List <ArrowRight className="h-4 w-4 ml-2" /></Button>
                    </li>
                    <li className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Performance report generated</p>
                            <p className="text-sm text-muted-foreground">1 hour ago</p>
                        </div>
                        <Button variant="outline" size="sm">View Report <ArrowRight className="h-4 w-4 ml-2" /></Button>
                    </li>
                </ul>
            </div>
        </DashboardContent>
    );
};

export default OverviewDashboard;
