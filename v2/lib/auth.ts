import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/auth"

export const auth = async () => {
  const session = await getServerSession(authConfig)
  return session
} 