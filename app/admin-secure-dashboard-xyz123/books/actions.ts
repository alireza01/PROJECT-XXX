"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function createBook(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  try {
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const level = formData.get("level") as string
    const language = formData.get("language") as string
    const pages = parseInt(formData.get("pages") as string)
    const description = formData.get("description") as string
    const cover = formData.get("cover") as File

    if (!title || !author || !level || !language || !pages || !description || !cover) {
      throw new Error("لطفا تمام فیلدها را پر کنید")
    }

    // Upload cover image to storage (implement this based on your storage solution)
    const coverUrl = await uploadImage(cover)

    await prisma.book.create({
      data: {
        title,
        author,
        level,
        language,
        pages,
        description,
        coverUrl,
      },
    })

    revalidatePath("/admin-secure-dashboard-xyz123/books")
    return { success: true }
  } catch (error) {
    console.error("Error creating book:", error)
    return { success: false, error: error instanceof Error ? error.message : "خطا در ایجاد کتاب" }
  }
}

async function uploadImage(file: File): Promise<string> {
  // Implement your image upload logic here
  // This could be to a cloud storage service like AWS S3, Cloudinary, etc.
  // For now, we'll return a placeholder
  return "https://via.placeholder.com/300x400"
}

export async function updateBook(id: string, data: {
  title: string
  author: string
  level: string
  language: string
  pages: number
  description: string
  content: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  try {
    const { title, author, level, language, pages, description, content } = data

    if (!title || !author || !level || !language || !pages || !description || !content) {
      throw new Error("لطفا تمام فیلدها را پر کنید")
    }

    await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        level,
        language,
        pages,
        description,
        content,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/admin-secure-dashboard-xyz123/books")
    return { success: true }
  } catch (error) {
    console.error("Error updating book:", error)
    return { success: false, error: error instanceof Error ? error.message : "خطا در بروزرسانی کتاب" }
  }
}

export async function deleteBook(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  try {
    await prisma.book.delete({
      where: { id },
    })

    revalidatePath("/admin-secure-dashboard-xyz123/books")
    return { success: true }
  } catch (error) {
    console.error("Error deleting book:", error)
    return { success: false, error: error instanceof Error ? error.message : "خطا در حذف کتاب" }
  }
}

export async function getBook(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id },
    })

    if (!book) {
      throw new Error("کتاب مورد نظر یافت نشد")
    }

    return { success: true, book }
  } catch (error) {
    console.error("Error getting book:", error)
    return { success: false, error: error instanceof Error ? error.message : "خطا در دریافت اطلاعات کتاب" }
  }
} 