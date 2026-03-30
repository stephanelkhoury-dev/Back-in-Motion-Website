import SuperAdminSidebar from '@/components/layout/SuperAdminSidebar';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SuperAdminSidebar />
      <main className="flex-1 bg-muted p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
