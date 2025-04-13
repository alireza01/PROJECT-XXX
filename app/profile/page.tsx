"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Camera, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Predefined avatar options
const avatarOptions = [
  { id: "avatar1", src: "/avatars/avatar1.png", name: "Avatar 1" },
  { id: "avatar2", src: "/avatars/avatar2.png", name: "Avatar 2" },
  { id: "avatar3", src: "/avatars/avatar3.png", name: "Avatar 3" },
  { id: "avatar4", src: "/avatars/avatar4.png", name: "Avatar 4" },
  { id: "avatar5", src: "/avatars/avatar5.png", name: "Avatar 5" },
  { id: "avatar6", src: "/avatars/avatar6.png", name: "Avatar 6" },
]

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setSelectedAvatar(session.user.image || "")
      
      // Fetch user profile data
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/profile")
          if (response.ok) {
            const data = await response.json()
            setBio(data.bio || "")
          }
        } catch (err) {
          console.error("Error fetching profile:", err)
        }
      }
      
      fetchProfile()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          bio,
          image: selectedAvatar,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
          image: selectedAvatar,
        },
      })

      setSuccess("پروفایل شما با موفقیت بروزرسانی شد")
    } catch (err: any) {
      setError(err.message || "خطا در بروزرسانی پروفایل")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">پروفایل کاربری</CardTitle>
            <CardDescription className="text-muted-foreground">
              اطلاعات پروفایل خود را مدیریت کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedAvatar || session.user?.image || ""} alt={name || "User"} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{name || "کاربر"}</h3>
                  <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">نام</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">درباره من</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="درباره خود بنویسید"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>انتخاب آواتار</Label>
                <RadioGroup
                  value={selectedAvatar}
                  onValueChange={setSelectedAvatar}
                  className="grid grid-cols-3 gap-4"
                >
                  {avatarOptions.map((avatar) => (
                    <div key={avatar.id} className="flex flex-col items-center space-y-2">
                      <RadioGroupItem
                        value={avatar.src}
                        id={avatar.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={avatar.id}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={avatar.src} alt={avatar.name} />
                          <AvatarFallback>{avatar.name}</AvatarFallback>
                        </Avatar>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    در حال ذخیره...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Save className="h-4 w-4 mr-2" />
                    ذخیره تغییرات
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
