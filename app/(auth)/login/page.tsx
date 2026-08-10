import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Sign in — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user?.status === "APPROVED") redirect("/dashboard");
  if (user) redirect("/pending");

  return <LoginForm />;
}
