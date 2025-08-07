import React, { useState } from "react";

type AuthFormProps = {
  type: "login" | "register";
  onSubmit: (data: { name?: string; email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string;
};

export function AuthForm({ type, onSubmit, loading, error }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, password });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {type === "register" && (
        <label className="flex flex-col gap-1">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
      </label>
      <button
        type="submit"
        className={`rounded px-4 py-2 mt-4 text-white ${type === "login" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
        disabled={loading}
      >
        {loading ? "Loading..." : type === "login" ? "Login" : "Register"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
