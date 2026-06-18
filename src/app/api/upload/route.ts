import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure unique filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${Date.now()}_${baseName}${ext}`;

    const imagesDir = path.join(process.cwd(), "public/images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filePath = path.join(imagesDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const url = `/images/${fileName}`;
    return NextResponse.json({ success: true, url, fileName });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
