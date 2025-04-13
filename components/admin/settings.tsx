import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('fa');
  const [fontSize, setFontSize] = useState('16');
  const [apiKey, setApiKey] = useState('');

  const handleSave = async () => {
    // TODO: Implement settings save logic
    console.log({ isDarkMode, language, fontSize, apiKey });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>حالت تاریک</Label>
          <p className="text-sm text-gray-500">
            تغییر حالت نمایش به تاریک یا روشن
          </p>
        </div>
        <Switch
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">زبان</Label>
        <Select
          value={language}
          onValueChange={setLanguage}
        >
          <SelectTrigger>
            <SelectValue placeholder="انتخاب زبان" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fa">فارسی</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontSize">اندازه فونت</Label>
        <Select
          value={fontSize}
          onValueChange={setFontSize}
        >
          <SelectTrigger>
            <SelectValue placeholder="انتخاب اندازه فونت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="14">کوچک</SelectItem>
            <SelectItem value="16">متوسط</SelectItem>
            <SelectItem value="18">بزرگ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">کلید API</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="کلید API را وارد کنید"
        />
        <p className="text-sm text-gray-500">
          کلید API برای دسترسی به سرویس‌های خارجی
        </p>
      </div>

      <Button
        onClick={handleSave}
        className="w-full"
      >
        <SettingsIcon className="ml-2 h-4 w-4" />
        ذخیره تنظیمات
      </Button>
    </div>
  );
} 