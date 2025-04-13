import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-[#F8F3E9] border-t border-[#E6D7B8]">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 bg-gradient-to-br from-[#E6B980] to-[#D29E64] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                B
              </div>
              <span className="font-bold text-xl text-[#5D4B35]">کتاب‌خوان</span>
            </Link>
            <p className="text-[#7D6E56] mb-4">پلتفرم هوشمند خواندن کتاب‌های انگلیسی با ترجمه و توضیحات فارسی</p>
            <div className="flex space-x-4 space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-[#D29E64] hover:bg-[#E6D7B8]/50 hover:text-[#D29E64]"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">فیسبوک</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-[#D29E64] hover:bg-[#E6D7B8]/50 hover:text-[#D29E64]"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">توییتر</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-[#D29E64] hover:bg-[#E6D7B8]/50 hover:text-[#D29E64]"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">اینستاگرام</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-[#D29E64] hover:bg-[#E6D7B8]/50 hover:text-[#D29E64]"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">یوتیوب</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#5D4B35] mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2">
              {[
                { title: "خانه", href: "/" },
                { title: "کتابخانه", href: "/library" },
                { title: "دسته‌بندی‌ها", href: "/categories" },
                { title: "سوالات متداول", href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#7D6E56] hover:text-[#D29E64] transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#5D4B35] mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D29E64] ml-2 mt-0.5" />
                <span className="text-[#7D6E56]">تهران، خیابان ولیعصر، برج کتاب</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#D29E64] ml-2" />
                <span className="text-[#7D6E56]">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#D29E64] ml-2" />
                <span className="text-[#7D6E56]">info@booklearn.ir</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#5D4B35] mb-4">خبرنامه</h3>
            <p className="text-[#7D6E56] mb-4">برای دریافت آخرین اخبار و کتاب‌های جدید در خبرنامه ما عضو شوید</p>
            <div className="flex gap-2">
              <Input
                placeholder="ایمیل خود را وارد کنید"
                className="bg-white border-[#E6D7B8] focus-visible:ring-[#D29E64] rounded-full"
              />
              <Button className="bg-gradient-to-r from-[#E6B980] to-[#D29E64] hover:opacity-90 text-white rounded-full shadow-md">
                عضویت
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6D7B8] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#7D6E56] text-sm mb-4 md:mb-0">© ۱۴۰۳ کتاب‌خوان. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-[#7D6E56] hover:text-[#D29E64]">
              قوانین و مقررات
            </Link>
            <Link href="/privacy" className="text-sm text-[#7D6E56] hover:text-[#D29E64]">
              حریم خصوصی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
