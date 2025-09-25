export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Main Blog. 保留所有权利。</span>
        <span className="text-slate-600">Powered by Next.js & Tailwind CSS</span>
      </div>
    </footer>
  );
}
