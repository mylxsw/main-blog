import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";

export const dynamic = "force-static";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-16">
        <section className="flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Stay curious.</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            每天一点点，构建你的知识宇宙。
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-300 sm:text-lg">
            这个博客使用现代化的 React 技术栈构建，提供稳定、可维护且性能出色的阅读体验。
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slugPath} post={post} />
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-100">想要合作或交流？</h2>
          <p className="mt-3 text-sm text-slate-400">
            随时通过
            <a href="mailto:hello@example.com" className="mx-1 font-medium text-sky-400 hover:text-sky-300">
              hello@example.com
            </a>
            联系我。
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
