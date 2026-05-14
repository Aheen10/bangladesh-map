import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "../../lib/rateLimit";

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name + " District")}`,
      { next: { revalidate: 86400 } }
    );

    const data = await res.json();

    if (data.extract) {
      return NextResponse.json(
        {
          extract: data.extract,
          thumbnail: data.thumbnail?.source || null,
          url: data.content_urls?.desktop?.page || null,
        },
        {
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
          },
        }
      );
    }

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
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}