import Link from "next/link";

import type { PostSummary } from "@/lib/posts";

interface Props {
  post: PostSummary;
}

export default function PostCard({ post }: Props) {
  return (
    <article className="group rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 transition hover:border-sky-500/40 hover:bg-slate-900/70">
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{post.formattedDate}</p>
        <Link href={`/${post.slugPath}`} className="text-2xl font-semibold text-slate-100 transition group-hover:text-sky-300">
          {post.title}
        </Link>
        <p className="text-sm text-slate-400">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 tracking-[0.2em]">
              {tag}
            </span>
          ))}
          <span className="ml-auto text-slate-500">{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
