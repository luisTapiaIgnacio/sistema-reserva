import type { Metadata } from "next";
import type { ReactNode } from "react";

// El panel no debe aparecer en Google
export const metadata: Metadata = {
  title: "Panel | Miranda Magic Mirror",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}