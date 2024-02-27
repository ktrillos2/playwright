import { StarsCanvas } from "@/components";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-auth">
      <StarsCanvas />
      <main className="flex justify-center">{children}</main>
    </div>
  );
}
