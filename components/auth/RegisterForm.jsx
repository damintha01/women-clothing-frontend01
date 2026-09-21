"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { validateRegisterInput } from "@/lib/validation";
import { toast } from "@/lib/toast";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const fieldErrors = validateRegisterInput(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(values);
      toast.success("Welcome to Ceylon.");
      router.push("/account/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-5">
      {[
        { key: "name", label: "Full name", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "password", label: "Password", type: "password" },
        { key: "confirmPassword", label: "Confirm password", type: "password" },
      ].map((field) => (
        <div key={field.key}>
          <label className="eyebrow text-muted-foreground">{field.label}</label>
          <input
            type={field.type}
            value={values[field.key]}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
          />
          {errors[field.key] && <p className="mt-1 text-xs text-destructive">{errors[field.key]}</p>}
        </div>
      ))}
      <button className="btn-lux w-full" disabled={submitting}>
        {submitting ? "Creating account…" : "Create Account"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link href="/login" className="line-link text-foreground">
          Sign in
        </Link>
      </p>
    </form>
  );
}
