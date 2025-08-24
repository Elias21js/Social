"use client";

import { usePathname } from "next/navigation";
import { Header } from "./index";

export function HeaderWrapper() {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) return null;

  return <Header />;
}
