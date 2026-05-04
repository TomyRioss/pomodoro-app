import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://zenquotes.io/api/random", {
    next: { revalidate: 21600 },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
