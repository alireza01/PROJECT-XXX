"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'نام سایت الزامی است'),
  siteDescription: z.string().min(1, 'توضیحات سایت الزامی است'),
  contactEmail: z.string().email('ایمیل معتبر نیست'),
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialSettings?: Partial<SettingsFormData>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings,
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsLoading(true);
      const supabase = createServerActionClient({ cookies });
      
      const { error } = await supabase
        .from('settings')
        .upsert([data]);

      if (error) throw error;
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">نام سایت</Label>
          <Input
            id="siteName"
            {...register('siteName')}
          />
          {errors.siteName && (
            <Alert variant="destructive">
              <AlertDescription>{errors.siteName.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteDescription">توضیحات سایت</Label>
          <Textarea
            id="siteDescription"
            {...register('siteDescription')}
          />
          {errors.siteDescription && (
            <Alert variant="destructive">
              <AlertDescription>{errors.siteDescription.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">ایمیل تماس</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register('contactEmail')}
          />
          {errors.contactEmail && (
            <Alert variant="destructive">
              <AlertDescription>{errors.contactEmail.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label>شبکه‌های اجتماعی</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Twitter"
                {...register('socialLinks.twitter')}
              />
              {errors.socialLinks?.twitter && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.socialLinks.twitter.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Input
                placeholder="Facebook"
                {...register('socialLinks.facebook')}
              />
              {errors.socialLinks?.facebook && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.socialLinks.facebook.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Input
                placeholder="Instagram"
                {...register('socialLinks.instagram')}
              />
              {errors.socialLinks?.instagram && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.socialLinks.instagram.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </Button>
    </form>
  );
} 