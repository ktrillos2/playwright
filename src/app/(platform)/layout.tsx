import { Navbar } from "@/components";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col justify-center p-8">
        {children}
      </main>
    </div>
  );
}
