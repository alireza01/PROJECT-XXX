"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Sparkles, BookMarked, Lightbulb, Layers } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-[#6949FF]" />,
      title: "کتابخانه دیجیتال",
      description: "دسترسی به مجموعه‌ای از کتاب‌های انگلیسی در ژانرهای مختلف",
    },
    {
      icon: <Brain className="h-10 w-10 text-[#C961DE]" />,
      title: "ترجمه هوشمند",
      description: "ترجمه کلمات دشوار با حفظ مفهوم و نکات فرهنگی به فارسی روان",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-[#6949FF]" />,
      title: "سطح‌بندی هوشمند",
      description: "تشخیص خودکار کلمات دشوار بر اساس سطح زبانی شما",
    },
    {
      icon: <BookMarked className="h-10 w-10 text-[#C961DE]" />,
      title: "نشانک‌گذاری پیشرفته",
      description: "ذخیره صفحات و کلمات مهم برای مرور بعدی",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-[#6949FF]" />,
      title: "یادگیری تعاملی",
      description: "تقویت دانش زبانی با تمرین‌های هوشمند و شخصی‌سازی شده",
    },
    {
      icon: <Layers className="h-10 w-10 text-[#C961DE]" />,
      title: "رابط کاربری مدرن",
      description: "تجربه مطالعه لذت‌بخش با طراحی زیبا و انیمیشن‌های روان",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            ویژگی‌های منحصر به فرد
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            با امکانات پیشرفته و هوشمند، تجربه خواندن کتاب‌های انگلیسی را به سطح جدیدی ارتقا دهید
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
