import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
              React Component Generator
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Sign in to continue
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
