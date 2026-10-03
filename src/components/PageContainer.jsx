export default function PageContainer({ children }) {
  return (
    <main className="px-7 py-6">
      <div className="mx-auto w-full max-w-[1400px]">
        {children}
      </div>
    </main>
  );
}