import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("access_token")?.value;
  const folder = req.nextUrl.searchParams.get("folder") ?? "uploads";
  const formData = await req.formData();

  const apiUrl = process.env.API_URL_INTERNAL ?? "http://backend:3001/api/v1";
  const res = await fetch(`${apiUrl}/media/upload?folder=${folder}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
