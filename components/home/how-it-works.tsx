"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "انتخاب کتاب",
      description: "از میان کتاب‌های متنوع، کتاب مورد علاقه خود را انتخاب کنید",
      image: "/placeholder.svg?height=300&width=200",
    },
    {
      title: "تعیین سطح زبانی",
      description: "سطح زبان انگلیسی خود را مشخص کنید تا کلمات متناسب با سطح شما مشخص شوند",
      image: "/placeholder.svg?height=300&width=200",
    },
    {
      title: "مطالعه هوشمند",
      description: "کلمات دشوار با رنگ‌های متفاوت مشخص می‌شوند و با کلیک روی آن‌ها معنی و توضیحات را ببینید",
      image: "/placeholder.svg?height=300&width=200",
    },
    {
      title: "یادگیری و پیشرفت",
      description: "با مطالعه مستمر، دایره لغات خود را گسترش دهید و مهارت زبانی خود را تقویت کنید",
      image: "/placeholder.svg?height=300&width=200",
    },
  ]

  return (
    <section className="py-20 px-4 bg-purple-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            چگونه کار می‌کند؟
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            در چند گام ساده، تجربه متفاوتی از خواندن کتاب‌های انگلیسی داشته باشید
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-20"></div>
                <div className="relative bg-white p-2 rounded-full shadow-lg">
                  <div className="bg-purple-100 rounded-full p-4">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={60}
                      height={60}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                <div className="absolute top-1/2 -right-full transform -translate-y-1/2 hidden lg:block">
                  <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0 10H100M100 10L90 5M100 10L90 15"
                      stroke="#D1D5DB"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-xl max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-6 text-center">مزایای استفاده از پلتفرم ما</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "افزایش سرعت یادگیری زبان انگلیسی",
              "درک بهتر متون انگلیسی",
              "گسترش دایره لغات",
              "یادگیری اصطلاحات و عبارات کاربردی",
              "صرفه‌جویی در زمان با حذف نیاز به مراجعه به دیکشنری",
              "تجربه لذت‌بخش مطالعه به زبان اصلی",
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
