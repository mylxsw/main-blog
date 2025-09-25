import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/system/about", label: "关于" },
];

export default function Header() {
  return (
    <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-100">
          Main Blog
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-sky-400">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
