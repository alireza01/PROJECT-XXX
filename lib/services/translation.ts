const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface TranslationContext {
  text: string;
  bookId: string;
  context: string;
  bookTitle?: string;
  authorName?: string;
}

interface TranslationResult {
  translatedText: string;
  notes: string[];
  timestamp: string;
  originalContext?: {
    before: string;
    selected: string;
    after: string;
  };
}

async function translateWithGemini(
  text: string,
  context: { before: string; after: string; bookTitle?: string; authorName?: string }
): Promise<{ translatedText: string; notes: string[] }> {
  const prompt = `متن: "${text}"

زمینه متن:
${context.before ? `قبل: ${context.before}` : ''}
${context.after ? `بعد: ${context.after}` : ''}
${context.bookTitle ? `کتاب: ${context.bookTitle}` : ''}
${context.authorName ? `نویسنده: ${context.authorName}` : ''}

فقط این فرمت JSON را برگردان:
{
  "translatedText": "معنی دقیق به فارسی",
  "notes": [
    "معنی دقیق کلمه: [معنی لغوی]",
    "مفهوم در این متن: [توضیح روان]",
    "اصطلاحات مرتبط: [اگر وجود دارد]"
  ]
}`;

  const response = await fetch(`${GEMINI_API_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1, // Very low temperature for consistent output
        topK: 10,
        topP: 0.5,
        maxOutputTokens: 500
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Gemini API request failed');
  }

  const data = await response.json();
  
  try {
    let responseText = data.candidates[0].content.parts[0].text.trim();
    
    // Remove any extra text before the JSON
    const jsonStart = responseText.indexOf('{');
    if (jsonStart !== -1) {
      responseText = responseText.slice(jsonStart);
    }
    
    const parsedResponse = JSON.parse(responseText);
    return {
      translatedText: parsedResponse.translatedText || '',
      notes: Array.isArray(parsedResponse.notes) ? 
        parsedResponse.notes.filter((note: string) => note && note.trim()) : []
    };
  } catch (e) {
    // If JSON parsing fails, try to extract translation from the text
    const text = data.candidates[0].content.parts[0].text;
    const translationMatch = text.match(/["']translatedText["']\s*:\s*["']([^"']+)["']/);
    return {
      translatedText: translationMatch ? translationMatch[1] : text,
      notes: []
    };
  }
}

export async function translateText({
  text,
  bookId,
  context,
  bookTitle,
  authorName,
}: TranslationContext): Promise<TranslationResult> {
  try {
    const { before, after } = extractContext(context, text);
    
    const translationResult = await translateWithGemini(
      text,
      {
        before,
        after,
        bookTitle,
        authorName,
      }
    );
    
    return {
      ...translationResult,
      timestamp: new Date().toISOString(),
      originalContext: {
        before,
        selected: text,
        after,
      }
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}

function extractContext(fullText: string, selectedText: string): { before: string; after: string } {
  const maxContextLength = 100; // Characters to include before and after
  const textIndex = fullText.indexOf(selectedText);
  
  if (textIndex === -1) {
    return { before: '', after: '' };
  }

  const beforeStart = Math.max(0, textIndex - maxContextLength);
  const afterEnd = Math.min(fullText.length, textIndex + selectedText.length + maxContextLength);

  return {
    before: fullText.slice(beforeStart, textIndex).trim(),
    after: fullText.slice(textIndex + selectedText.length, afterEnd).trim(),
  };
}

export function getSurroundingText(
  text: string,
  selectedText: string,
  contextLines: number = 3
): string {
  const lines = text.split('\n');
  const selectedLineIndex = lines.findIndex(line => line.includes(selectedText));

  if (selectedLineIndex === -1) {
    return '';
  }

  const start = Math.max(0, selectedLineIndex - contextLines);
  const end = Math.min(lines.length, selectedLineIndex + contextLines + 1);

  return lines.slice(start, end).join('\n');
} 