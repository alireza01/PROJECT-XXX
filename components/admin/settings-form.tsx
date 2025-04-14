"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'نام سایت الزامی است'),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('ایمیل معتبر نیست').optional(),
  socialMedia: z.object({
    twitter: z.string().url('آدرس معتبر نیست').optional(),
    instagram: z.string().url('آدرس معتبر نیست').optional(),
    telegram: z.string().url('آدرس معتبر نیست').optional(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, ...data });

      if (error) throw error;
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="siteName">نام سایت</Label>
        <Input
          id="siteName"
          {...register('siteName')}
          placeholder="نام سایت خود را وارد کنید"
        />
        {errors.siteName && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{errors.siteName.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <Label htmlFor="siteDescription">توضیحات سایت</Label>
        <Input
          id="siteDescription"
          {...register('siteDescription')}
          placeholder="توضیحات سایت خود را وارد کنید"
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">ایمیل تماس</Label>
        <Input
          id="contactEmail"
          type="email"
          {...register('contactEmail')}
          placeholder="ایمیل تماس خود را وارد کنید"
        />
        {errors.contactEmail && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{errors.contactEmail.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">شبکه‌های اجتماعی</h3>

        <div>
          <Label htmlFor="twitter">توییتر</Label>
          <Input
            id="twitter"
            {...register('socialMedia.twitter')}
            placeholder="لینک توییتر"
          />
          {errors.socialMedia?.twitter && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                {errors.socialMedia.twitter.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Label htmlFor="instagram">اینستاگرام</Label>
          <Input
            id="instagram"
            {...register('socialMedia.instagram')}
            placeholder="لینک اینستاگرام"
          />
          {errors.socialMedia?.instagram && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                {errors.socialMedia.instagram.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Label htmlFor="telegram">تلگرام</Label>
          <Input
            id="telegram"
            {...register('socialMedia.telegram')}
            placeholder="لینک تلگرام"
          />
          {errors.socialMedia?.telegram && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                {errors.socialMedia.telegram.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </Button>
    </form>
  );
} 