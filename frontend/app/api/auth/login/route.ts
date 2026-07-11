import { NextRequest, NextResponse } from "next/server";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const { accessToken } = await authApi.login(email, password);
    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof ApiError ? err.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ success: false, message }, { status });
  }
}
