import type { Route } from "./+types/home";
import { SignUp } from "../pages/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Register() {
  return <SignUp />;
}
