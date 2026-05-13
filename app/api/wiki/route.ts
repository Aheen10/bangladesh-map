import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  try {
    // First try with "District" suffix
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name + " District")}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    const data = await res.json();

    if (data.extract) {
      return NextResponse.json({
        extract: data.extract,
        thumbnail: data.thumbnail?.source || null,
        url: data.content_urls?.desktop?.page || null,
      });
    }

    // Fallback without "District"
    const res2 = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      { next: { revalidate: 86400 } }
    );

    const data2 = await res2.json();

    return NextResponse.json({
      extract: data2.extract || "No description available.",
      thumbnail: data2.thumbnail?.source || null,
      url: data2.content_urls?.desktop?.page || null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch Wikipedia data" }, { status: 500 });
  }
}