"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Profile {
  id: string
  name: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  avatar_url: string | null
  updated_at: string | null
}

interface ProfileFormProps {
  user: SupabaseUser
  profile: Profile
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || "")
  const [level, setLevel] = useState<Profile['level']>(profile?.level || "intermediate")
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: name || null,
          level,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      toast({
        title: "Profile Updated",
        description: "Changes saved successfully",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Error Updating Profile",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsLoading(true)
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif']
      
      if (!fileExt || !validExtensions.includes(fileExt)) {
        throw new Error('Selected file must be an image (jpg, jpeg, png, gif)')
      }
      
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(data.publicUrl)
      
      toast({
        title: "Profile Image Uploaded",
        description: "Image uploaded successfully. Submit the form to save changes.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Error Uploading Image",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-gold-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gold-800 dark:text-gold-200">Personal Information</CardTitle>
          <CardDescription className="text-gold-700 dark:text-gold-300">
            Manage your profile information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-gold-200 dark:border-gray-800">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile Image" />
                  <AvatarFallback className="bg-gold-300 text-white text-2xl">
                    {name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center">
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer text-gold-400 hover:text-gold-500 dark:hover:text-gold-300 flex items-center gap-1 text-sm"
                  >
                    Upload Image
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={level}
                    onValueChange={(value: Profile['level']) => setLevel(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gold-500 text-white rounded-md hover:bg-gold-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
