import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!verifySessionToken(sessionToken)) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
