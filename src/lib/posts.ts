import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  location: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}

export interface Post extends PostMeta {
  contentHtml: string;
}

/** Extract the first image URL from markdown content */
function extractFirstImage(content: string): string {
  // Match ![alt](url) pattern
  const match = content.match(/!\[.*?\]\((.+?)\)/);
  return match ? match[1] : "";
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      // Use coverImage from frontmatter, fallback to first image in content
      const coverImage = data.coverImage || extractFirstImage(content) || "";
      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        location: data.location || "",
        excerpt: data.excerpt || "",
        coverImage,
        tags: data.tags || [],
      };
    });
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  // Use coverImage from frontmatter, fallback to first image in content
  const coverImage = data.coverImage || extractFirstImage(content) || "";

  return {
    slug,
    title: data.title || "",
    date: data.date || "",
    location: data.location || "",
    excerpt: data.excerpt || "",
    coverImage,
    tags: data.tags || [],
    contentHtml,
  };
}

export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}
