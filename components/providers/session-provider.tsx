// @/components/providers/session-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import type React from "react";

interface Props {
  children: React.ReactNode;
  // session?: any; // Session prop is optional, SessionProvider can fetch it
}

export default function NextAuthProvider({ children }: Props) {
  // The SessionProvider component takes care of fetching the session
  // on the client-side if it's not passed via props (which is common in App Router)
  return <SessionProvider>{children}</SessionProvider>;
}