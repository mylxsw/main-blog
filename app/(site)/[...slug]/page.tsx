import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressiveImage from "@/components/ProgressiveImage";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

interface PageProps {
  params: { slug: string[] };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slugSegments }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export const dynamicParams = false;

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950">
        <Header />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-semibold text-slate-100">文章没有找到</h1>
          <p className="mt-4 text-slate-400">这篇文章可能已经被移动或删除。</p>
          <Link href="/" className="mt-6 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400">
            返回首页
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 py-16">
        <article className="prose prose-invert prose-slate max-w-none">
          <header className="mb-8 flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{post.formattedDate}</p>
            <h1 className="text-4xl font-semibold text-slate-50">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {post.tags.length > 0 && (
                <span className="flex items-center gap-2">
                  <span className="font-medium text-slate-300">标签</span>
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-700/80 bg-slate-800/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
          </header>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
            components={{
              img: ({ alt, src, className }) => (
                <ProgressiveImage alt={alt ?? ""} src={src ?? ""} className={className} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
