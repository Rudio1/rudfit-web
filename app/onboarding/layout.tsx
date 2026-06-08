export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background pt-[env(safe-area-inset-top)]">
      {children}
    </div>
  );
}
