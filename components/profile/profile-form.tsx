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

interface ProfileFormProps {
  user: SupabaseUser
  profile: any
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || "")
  const [level, setLevel] = useState(profile?.level || "intermediate")
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
          name,
          level,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      toast({
        title: "پروفایل به‌روزرسانی شد",
        description: "تغییرات با موفقیت ذخیره شد",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "خطا در به‌روزرسانی پروفایل",
        description: error.message || "لطفاً دوباره تلاش کنید",
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
      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(data.publicUrl)
      
      toast({
        title: "تصویر پروفایل آپلود شد",
        description: "تصویر با موفقیت آپلود شد. برای ذخیره تغییرات، فرم را ثبت کنید.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "خطا در آپلود تصویر",
        description: error.message || "لطفاً دوباره تلاش کنید",
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
          <CardTitle className="text-gold-800 dark:text-gold-200">اطلاعات شخصی</CardTitle>
          <CardDescription className="text-gold-700 dark:text-gold-300">
            اطلاعات پروفایل و تنظیمات خود را مدیریت کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-gold-200 dark:border-gray-800">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="تصویر پروفایل" />
                  <AvatarFallback className="bg-gold-300 text-white text-2xl">
                    {name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center">
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer text-gold-400 hover:text-gold-500 dark:hover:text-gold-300 flex items-center gap-1 text-sm">
                    آپلود تصویر
                  </Label>
                </div>\
