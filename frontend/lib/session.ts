import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get("access_token")?.value ?? null;
}

export async function requireToken(): Promise<string> {
  const token = await getToken();
  if (!token) redirect("/admin/login");
  return token;
}
