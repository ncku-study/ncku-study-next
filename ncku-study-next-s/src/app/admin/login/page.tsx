"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Lock, Loader2, Package } from "lucide-react";

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(true);
      } else {
        router.push("/admin/major");
        router.refresh();
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full min-h-[calc(100vh-64px)] flex justify-center items-center">
      <div className="w-[350px] py-[25px]">
        <div className="inline-block text-center w-full">
          <div className="flex justify-center mb-2">
            <Package className="w-[100px] h-[100px] text-[var(--color-yellow)]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[30px] mt-[10px] mb-[20px] font-bold">
            {t("title")}
          </h2>
          {!loading && error && (
            <p className="text-[var(--color-red)] text-[1.4rem] mb-4">
              {t("error")}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex items-center my-[15px] mx-auto border-b-2 border-[var(--color-light-gray)] focus-within:border-[var(--color-yellow)] transition-colors pb-2">
            <User className="text-[var(--color-yellow)] w-[23px] h-[23px] mr-3" />
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[1.8rem] text-[var(--color-light-black)] outline-none bg-transparent"
              required
            />
          </div>

          <div className="flex items-center my-[15px] mx-auto border-b-2 border-[var(--color-light-gray)] focus-within:border-[var(--color-yellow)] transition-colors pb-2 mt-8">
            <Lock className="text-[var(--color-yellow)] w-[23px] h-[23px] mr-3" />
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-[1.8rem] text-[var(--color-light-black)] outline-none bg-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[40px] mt-[30px] text-[1.5rem] bg-[var(--color-yellow)] text-[var(--color-light-black)] font-medium rounded hover:opacity-90 flex justify-center items-center disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <Loader2 className="animate-spin w-[20px] h-[20px]" />
            ) : (
              t("submit")
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
