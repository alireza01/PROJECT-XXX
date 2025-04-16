import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config"
import { UserApiManager } from '@/components/user/UserApiManager'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your application dashboard with overview and API management.",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Welcome back!</h3>
              <p className="text-sm text-muted-foreground">
                This is your main dashboard. Here you can access all your features and see an overview of your activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Management Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">API Management</h2>
          <p className="text-muted-foreground">
            Manage your Gemini API keys and settings
          </p>
        </div>
        <UserApiManager />
      </div>
    </div>
  )
} 