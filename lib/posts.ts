import fs from "fs";
import path from "path";

import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_ROOT = path.join(process.cwd(), "content");

interface FrontMatter {
  title?: string;
  date?: string;
  tags?: string[];
  category?: string;
  seo?: string[];
  excerpt?: string;
}

export interface PostSummary {
  title: string;
  date: string | null;
  formattedDate: string;
  tags: string[];
  slugSegments: string[];
  slugPath: string;
  excerpt: string;
  readingTime: string;
}

export interface PostDetail extends PostSummary {
  content: string;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "未注明日期";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getMarkdownFiles(dir: string, relative = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    const entryRelative = path.join(relative, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(entryPath, entryRelative);
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      return [entryRelative];
    }

    return [];
  });
}

function normalizeTags(value?: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function buildExcerpt(content: string, frontMatter: FrontMatter): string {
  if (frontMatter.excerpt) {
    return frontMatter.excerpt;
  }

  const text = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*_`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  return text.slice(0, 120) + (text.length > 120 ? "…" : "");
}

function getPostMetadata(filePath: string) {
  const fullPath = path.join(CONTENT_ROOT, filePath);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const frontMatter = data as FrontMatter;
  const title = frontMatter.title ?? path.basename(filePath, ".md");
  const tags = normalizeTags(frontMatter.tags);
  const slugSegments = filePath.replace(/\\/g, "/").replace(/\.md$/, "").split("/");
  const slugPath = slugSegments.join("/");
  const date = frontMatter.date ?? null;

  return {
    title,
    date,
    formattedDate: formatDate(date),
    tags,
    slugSegments,
    slugPath,
    content,
    excerpt: buildExcerpt(content, frontMatter),
    readingTime: Math.max(Math.round(readingTime(content).minutes), 1) + " 分钟阅读",
  } satisfies PostDetail;
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const files = getMarkdownFiles(CONTENT_ROOT);
  const posts = files.map((file) => getPostMetadata(file));

  return posts
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (a.date) return -1;
      if (b.date) return 1;
      return a.title.localeCompare(b.title, "zh-CN");
    })
    .map(({ content: _content, ...summary }) => summary);
}

export async function getPostBySlug(slug: string[]): Promise<PostDetail | null> {
  const slugPath = slug.join("/");
  const filePath = `${slugPath}.md`;
  const possiblePaths = [filePath, path.join(slugPath, "index.md")];

  for (const candidate of possiblePaths) {
    const fullPath = path.join(CONTENT_ROOT, candidate);
    if (fs.existsSync(fullPath)) {
      return getPostMetadata(candidate);
    }
  }

  return null;
}
