import React, { useState } from "react";
import { AuthForm } from "../components/AuthForm";
import { register } from "../api/authApi";
import { useNavigate } from "react-router";

export function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleRegister = async ({
    name,
    email,
    password,
  }: {
    name?: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await register(name || "", email, password);
      localStorage.setItem("password", password); // שמור את הסיסמה
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
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            <AuthForm
              type="register"
              onSubmit={handleRegister}
              loading={loading}
              error={error}
            />
          </div>
        </header>
      </div>
    </main>
  );
}