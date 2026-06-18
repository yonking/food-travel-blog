import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export async function GET() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
      .filter((f) => f.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        return { slug, ...data, content };
      });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, date, location, excerpt, coverImage, tags, content } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "slug, title, content are required" }, { status: 400 });
    }

    const frontmatter = {
      title,
      date: date || new Date().toISOString().split("T")[0],
      location: location || "",
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      tags: tags || [],
    };

    const fileContent = matter.stringify(content, frontmatter);
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    fs.writeFileSync(fullPath, fileContent, "utf8");

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, date, location, excerpt, coverImage, tags, content } = body;

    if (!slug || !content) {
      return NextResponse.json({ error: "slug and content are required" }, { status: 400 });
    }

    const frontmatter = {
      title,
      date: date || new Date().toISOString().split("T")[0],
      location: location || "",
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      tags: tags || [],
    };

    const fileContent = matter.stringify(content, frontmatter);
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    fs.writeFileSync(fullPath, fileContent, "utf8");

    return NextResponse.json({ success: true, slug });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
