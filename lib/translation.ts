import { GoogleGenerativeAI } from "@google/generative-ai"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"
import { createClient } from "@supabase/supabase-js"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('Missing Google AI API key')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

interface TranslationResult {
  text: string
  error?: string
}

export async function translateText(text: string, targetLanguage: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Translate the following text to ${targetLanguage}. Only return the translation, nothing else:
    
    ${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text()

    return translatedText
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error("Failed to translate text")
  }
}

export async function detectLanguage(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Detect the language of the following text. Only return the language name in English, nothing else:
    
    ${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const detectedLanguage = response.text()

    return detectedLanguage
  } catch (error) {
    console.error("Language detection error:", error)
    throw new Error("Failed to detect language")
  }
}

export async function getTranslation(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { text: "", error: "Unauthorized" }
    }

    // Check user credits
    const { data: user } = await supabase
      .from("users")
      .select("credits")
      .eq("id", session.user.id)
      .single()

    if (!user || user.credits <= 0) {
      return { text: "", error: "Insufficient credits" }
    }

    // Deduct credit
    await supabase
      .from("users")
      .update({ credits: user.credits - 1 })
      .eq("id", session.user.id)

    // Generate translation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else:\n\n${text}`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text()

    return { text: translatedText }
  } catch (error) {
    console.error("Translation error:", error)
    return { text: "", error: "Translation failed" }
  }
} 