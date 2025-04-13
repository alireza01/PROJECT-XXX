"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Brain, Sparkles, BookMarked, Lightbulb, Layers } from "lucide-react"

export function AppFeatures() {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-[#D29E64]" />,
      title: "کتابخانه دیجیتال",
      description: "دسترسی به مجموعه‌ای از کتاب‌های انگلیسی در ژانرهای مختلف",
    },
    {
      icon: <Brain className="h-10 w-10 text-[#D29E64]" />,
      title: "ترجمه هوشمند",
      description: "ترجمه کلمات دشوار با حفظ مفهوم و نکات فرهنگی به فارسی روان",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-[#D29E64]" />,
      title: "سطح‌بندی هوشمند",
      description: "تشخیص خودکار کلمات دشوار بر اساس سطح زبانی شما",
    },
    {
      icon: <BookMarked className="h-10 w-10 text-[#D29E64]" />,
      title: "نشانک‌گذاری پیشرفته",
      description: "ذخیره صفحات و کلمات مهم برای مرور بعدی",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-[#D29E64]" />,
      title: "یادگیری تعاملی",
      description: "تقویت دانش زبانی با تمرین‌های هوشمند و شخصی‌سازی شده",
    },
    {
      icon: <Layers className="h-10 w-10 text-[#D29E64]" />,
      title: "رابط کاربری مدرن",
      description: "تجربه مطالعه لذت‌بخش با طراحی زیبا و انیمیشن‌های روان",
    },
  ]

  return (
    <section className="py-16 px-4 bg-[#F0E6D2]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#5D4B35] mb-4">ویژگی‌های منحصر به فرد</h2>
          <p className="text-[#7D6E56] max-w-2xl mx-auto">
            با امکانات پیشرفته و هوشمند، تجربه خواندن کتاب‌های انگلیسی را به سطح جدیدی ارتقا دهید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="border-none bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden group">
                <CardContent className="p-8">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#5D4B35] mb-3">{feature.title}</h3>
                  <p className="text-[#7D6E56]">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
