import type { Route } from "./+types/home";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const password = localStorage.getItem("password");
    if (!password) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>ברוך הבא לדשבורד!</p>
    </main>
  );
}