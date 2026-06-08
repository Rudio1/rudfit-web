export default function ProfileRecalculateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-[var(--page-padding-x)] -mt-[var(--page-padding-y)] min-w-0">
      {children}
    </div>
  );
}
