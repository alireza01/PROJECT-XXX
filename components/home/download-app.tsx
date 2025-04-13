"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Apple, Play } from "lucide-react"

export function DownloadApp() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#E6B980] to-[#D29E64] text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-right"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">اپلیکیشن کتاب‌خوان را دانلود کنید</h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto lg:mr-0">
              با اپلیکیشن کتاب‌خوان، در هر زمان و هر مکان به کتاب‌های مورد علاقه خود دسترسی داشته باشید. امکان مطالعه
              آفلاین، تنظیمات شخصی‌سازی و تجربه کاربری عالی در انتظار شماست.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button className="bg-white text-[#D29E64] hover:bg-white/90 rounded-full shadow-md h-14 px-6">
                <Apple className="h-6 w-6 ml-2" />
                <div className="text-right">
                  <div className="text-xs">دانلود از</div>
                  <div className="font-bold">App Store</div>
                </div>
              </Button>

              <Button className="bg-white text-[#D29E64] hover:bg-white/90 rounded-full shadow-md h-14 px-6">
                <Play className="h-6 w-6 ml-2 fill-[#D29E64]" />
                <div className="text-right">
                  <div className="text-xs">دریافت از</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative mx-auto max-w-xs">
              <div className="absolute inset-0 bg-white rounded-[40px] blur-xl opacity-20 transform rotate-6" />

              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                className="relative bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-white"
              >
                <Image
                  src="/placeholder.svg?height=600&width=300"
                  alt="Book reader app interface"
                  width={300}
                  height={600}
                  className="w-full h-auto"
                />

                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                  <div className="w-32 h-1 bg-white rounded-full opacity-80" />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 0, rotate: 0 }}
                animate={{
                  x: [0, -5, 0],
                  rotate: [-5, -3, -5],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                className="absolute -left-16 top-20 w-40 h-40 bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white transform -rotate-6"
              >
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="App feature"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
