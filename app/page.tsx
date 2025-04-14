// @/app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to{" "}
          <span className="text-primary">Your App Name</span>
        </h1>
        <p className="text-center text-2xl">
          Get started by editing{" "}
          <code className="rounded-md bg-muted px-2 py-1 font-mono text-lg">
            app/page.tsx
          </code>
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}