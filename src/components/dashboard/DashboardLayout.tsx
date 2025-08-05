"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Home,
    UploadCloud,
    List,
    BarChart2,
    Settings,
    Users,
    TrendingUp,
    LogOut,
    Menu,
    X,
    ChevronUp, // Added for ContactTable, though not explicitly requested here
} from "lucide-react";
import LandingDashboard from "./LandingDashboard";
import { Contact } from "@/src/interfaces/contactInterface";
import ContactTable from "./ContactTable";
import { ThemeSwitcher } from "../theme-switcher";
import { clientSignOut } from "@/src/utils/clientActions";
import { getCurrentUser } from "@/src/utils/sessionManager";

type Tab = "overview" | "import-data" | "call-lists" | "track-performance" | "manage-contacts" | "settings";

export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState<Tab>("import-data");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const handleUploadSuccess = (uploadedContacts: Contact[]) => {
        setContacts(uploadedContacts);
        setActiveTab("call-lists");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard Overview</h2>
                        <p className="text-muted-foreground">Welcome to your AutoDig Dashboard! Select an option from the left menu to get started.</p>
                    </div>
                );
            case "import-data":
                return <LandingDashboard onUploadSuccess={handleUploadSuccess} />;
            case "call-lists":
                return (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Call Lists & Processed Data</h2>
                        {contacts.length > 0 ? (
                            <ContactTable contacts={contacts} />
                        ) : (
                            <p className="text-muted-foreground">No call data available yet. Please import data to view your lists.</p>
                        )}
                    </div>
                );
            case "track-performance":
                return (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Performance Tracking</h2>
                        <p className="text-muted-foreground">View your outreach performance metrics and insights here.</p>
                    </div>
                );
            case "manage-contacts":
                return (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Manage Contacts</h2>
                        <p className="text-muted-foreground">Edit, view, or manage individual contact details.</p>
                    </div>
                );
            case "settings":
                return (
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Settings</h2>
                        <p className="text-muted-foreground">Adjust your account and application settings.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: Home },
        { id: "import-data", label: "Import Data", icon: UploadCloud },
        { id: "call-lists", label: "Call Lists", icon: List },
        { id: "track-performance", label: "Track Performance", icon: TrendingUp },
        { id: "manage-contacts", label: "Manage Contacts", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-w-full flex flex-col h-screen bg-background text-foreground">
            {/* Dashboard Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shadow-sm"> {/* Reduced py-4 to py-3 */}
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo-no-background.png"
                            alt="AutoDig"
                            width={25}
                            height={25}
                        />
                        <span className="text-autodigPrimary text-xl font-bold">AUTODIG</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <button
                        onClick={clientSignOut}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                               bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col shadow-lg
                     lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
                     ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    {/* Removed Logo from sidebar for desktop */}
                    {/* <div className="px-6 pt-6 pb-4 hidden lg:block">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-no-background.png"
                alt="AutoDig"
                width={20}
                height={20}
              />
              <span className="text-autodigPrimary text-lg font-bold">AUTODIG</span>
            </Link>
          </div> */}
                    <nav className="flex-grow pt-4">
                        <ul className="flex flex-col">
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setActiveTab(item.id as Tab);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`flex items-center w-full pl-6 pr-4 py-3 text-sm font-medium transition-colors duration-200 relative
                               ${activeTab === item.id
                                                ? "bg-autodigPrimary/10 text-autodigPrimary font-semibold after:absolute after:top-0 after:right-0 after:h-full after:w-1 after:bg-autodigPrimary rounded-l-lg"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* User Name at the bottom of the sidebar */}
                    <div className="mt-auto px-6 py-4 border-t border-border">
                        <div className="flex items-center gap-3 text-sm text-foreground font-semibold">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <Users size={16} />
                            </div>
                            <span>{user?.name || user?.email || 'User'}</span>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Right Content Area */}
                <main className="flex-1 overflow-y-auto p-8 bg-background"> {/* Added p-8 to main for overall content area padding */}
                    <div className="bg-card rounded-xl shadow-lg border border-border h-full w-full">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}