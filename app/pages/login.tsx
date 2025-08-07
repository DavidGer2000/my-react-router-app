import React, { useState } from "react";
import { AuthForm } from "../components/AuthForm";
import { login } from "../api/authApi";
import { useNavigate } from "react-router";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await login(email, password);
      localStorage.setItem("password", password); // שמור את הסיסמה
      // אפשר גם לשמור res.token אם יהיה בעתיד
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <AuthForm type="login" onSubmit={handleLogin} loading={loading} error={error} />
          </div>
        </header>
      </div>
    </main>
  );
}