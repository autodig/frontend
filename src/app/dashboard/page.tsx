import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import AuthGuard from "@/src/components/AuthGuard";

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  );
}