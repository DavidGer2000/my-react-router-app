import type { Route } from "./+types/home";
import { LoginPage } from "../pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
