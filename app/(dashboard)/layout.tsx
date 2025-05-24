// app/(dashboard)/layout.tsx
import MainLayout from "@/components/layout/main-layout";
import BreadcrumbsDynamic from "@/components/ui/breadcrumbs-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("DashboardLayout rendered");
  return (
    <MainLayout>
      <BreadcrumbsDynamic />
      {children}
    </MainLayout>
  );
}
