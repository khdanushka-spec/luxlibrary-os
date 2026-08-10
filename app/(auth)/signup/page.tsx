import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Request access — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user?.status === "APPROVED") redirect("/dashboard");
  if (user) redirect("/pending");

  return <SignupForm />;
}
