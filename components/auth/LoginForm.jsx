"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { validateLoginInput } from "@/lib/validation";
import { toast } from "@/lib/toast";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const fieldErrors = validateLoginInput(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const user = await login(values);
      const redirect = searchParams.get("redirect");
      router.push(user.role === "owner" ? "/admin" : redirect || "/account/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-5">
      <div>
        <label className="eyebrow text-muted-foreground">Email</label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>
      <div>
        <label className="eyebrow text-muted-foreground">Password</label>
        <input
          type="password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
      </div>
      <button className="btn-lux w-full" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign In"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="line-link text-foreground">
          Create an account
        </Link>
      </p>
    </form>
  );
}
