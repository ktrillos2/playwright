import { Navbar } from "@/components";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col justify-center pt-4 px-4 md:px-8 pb-4 sm:pb-8">
        {children}
      </main>
    </div>
  );
}