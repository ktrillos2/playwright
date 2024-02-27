import { Navbar } from "@/components/ui/buttons";
import { adminAuthMiddleware } from "@/config";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await adminAuthMiddleware()
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col justify-center pt-4 px-4 md:px-8 pb-4 sm:pb-8">
        {children}
      </main>
    </div>
  );
}