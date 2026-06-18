import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST() {
  try {
    const cwd = process.cwd();

    // Stage all changes
    execSync("git add -A", { cwd });

    // Check if there are changes to commit
    let hasChanges = true;
    try {
      execSync("git diff --cached --quiet", { cwd });
      hasChanges = false;
    } catch {
      // diff returns non-zero when there are changes
    }

    if (!hasChanges) {
      return NextResponse.json({ success: true, message: "No changes to deploy" });
    }

    // Commit
    const timestamp = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    execSync(`git commit -m "post: update content ${timestamp}"`, { cwd });

    // Push
    execSync("git push origin main", { cwd, timeout: 30000 });

    return NextResponse.json({
      success: true,
      message: `Deployed at ${timestamp}`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
