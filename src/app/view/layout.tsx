export default async function ViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {children}
    </div>
  );
}