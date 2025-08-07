import React from 'react';

interface DashboardContentProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ title, subtitle, children }) => {
    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{title}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
            </header>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                {children}
            </div>
        </div>
    );
};

export default DashboardContent;
