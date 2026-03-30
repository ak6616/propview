"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login?next=/portal");
    }
  }, [router]);

  return <>{children}</>;
}
