import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

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