"use server"

interface VisualConcept {
  mood: string[]
  tone: string
  colorPalette: string[]
  visualElements: string[]
  artStyle: string
  composition: string
  imagePrompts: string[]
  originalPrompt?: string
  detectedLanguage?: string
}

interface LearningTip {
  id: string
  category: "composition" | "color" | "style"
  title: string
  content: string
  example?: string
  relatedConcepts?: string[]
}

export async function generateLearningTips(concept: VisualConcept): Promise<LearningTip[]> {
  try {
    const response = await fetch("https://litellm.rillavoice.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-rilla-vibes",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-v2",
        messages: [
          {
            role: "system",
            content: `You are an expert art educator who creates personalized learning tips based on visual concepts. Generate 3-4 educational tips that relate to the user's concept, covering composition, color theory, and artistic styles.

Each tip should be:
1. Educational and informative
2. Directly related to the user's concept
3. Practical and actionable
4. Beginner-friendly but insightful

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "id": "unique_id",
    "category": "composition|color|style",
    "title": "Short descriptive title",
    "content": "Educational explanation (2-3 sentences)",
    "example": "Practical example or application",
    "relatedConcepts": ["concept1", "concept2"]
  }
]`,
          },
          {
            role: "user",
            content: `Generate educational tips based on this visual concept:
            Art Style: ${concept.artStyle}
            Composition: ${concept.composition}
            Color Palette: ${concept.colorPalette.join(", ")}
            Mood: ${concept.mood.join(", ")}
            Tone: ${concept.tone}
            Visual Elements: ${concept.visualElements.join(", ")}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    return JSON.parse(content) as LearningTip[]
  } catch (error) {
    console.error("Error generating learning tips:", error)
    return getDefaultLearningTips(concept)
  }
}

function getDefaultLearningTips(concept: VisualConcept): LearningTip[] {
  const tips: LearningTip[] = []

  // Composition tip based on concept
  if (concept.composition.toLowerCase().includes("horizontal")) {
    tips.push({
      id: "comp_horizontal",
      category: "composition",
      title: "Horizontal Composition",
      content:
        "Horizontal compositions create a sense of calm and stability. They're perfect for landscapes and peaceful scenes.",
      example: "Try placing your main subject along the horizontal thirds lines for better balance.",
      relatedConcepts: ["rule of thirds", "landscape orientation"],
    })
  }

  // Color tip based on palette
  const hasWarmColors = concept.colorPalette.some((color) => {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    return r > g && r > b // Simple warm color detection
  })

  if (hasWarmColors) {
    tips.push({
      id: "color_warm",
      category: "color",
      title: "Warm Color Psychology",
      content:
        "Warm colors like reds, oranges, and yellows evoke energy, passion, and comfort. They advance visually and grab attention.",
      example: "Use warm colors for focal points and cool colors for backgrounds to create depth.",
      relatedConcepts: ["color temperature", "visual hierarchy"],
    })
  }

  // Style tip
  tips.push({
    id: "style_general",
    category: "style",
    title: concept.artStyle,
    content: `${concept.artStyle} is characterized by specific techniques and visual approaches that create its unique aesthetic.`,
    example: "Study master works in this style to understand the key visual elements and techniques.",
    relatedConcepts: ["artistic movement", "visual techniques"],
  })

  return tips
}

export async function translatePrompt(prompt: string, targetLanguage = "en"): Promise<string> {
  try {
    const response = await fetch("https://litellm.rillavoice.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-rilla-vibes",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the given text to ${targetLanguage === "en" ? "English" : targetLanguage}. 
            
            Rules:
            1. Maintain the creative and artistic intent of the original text
            2. Preserve any artistic or technical terms appropriately
            3. If the text is already in the target language, return it unchanged
            4. Only return the translated text, no explanations
            5. Keep the same tone and style as the original`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error("Translation error:", error)
    return prompt
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch("https://litellm.rillavoice.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-rilla-vibes",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku",
        messages: [
          {
            role: "system",
            content: `Detect the language of the given text. Return only the ISO 639-1 language code (e.g., "en" for English, "es" for Spanish, "ja" for Japanese, "uk" for Ukrainian, "fr" for French, "de" for German, "it" for Italian, "pt" for Portuguese, "ru" for Russian, "zh" for Chinese, "ko" for Korean, "ar" for Arabic).
            
            If you cannot determine the language or if it's mixed languages, return "en".`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim().toLowerCase()
  } catch (error) {
    console.error("Language detection error:", error)
    return "en"
  }
}

export async function generateVisualConcept(
  prompt: string,
  originalLanguage?: string,
): Promise<VisualConcept & { originalPrompt?: string; detectedLanguage?: string }> {
  try {
    const detectedLang = originalLanguage || (await detectLanguage(prompt))

    let englishPrompt = prompt
    if (detectedLang !== "en") {
      englishPrompt = await translatePrompt(prompt, "en")
    }

    const response = await fetch("https://litellm.rillavoice.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-rilla-vibes",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-v2",
        messages: [
          {
            role: "system",
            content: `You are an expert visual artist and creative director who specializes in interpreting creative descriptions and translating them into detailed visual concepts. 

Your task is to analyze the user's creative prompt and extract:
1. Emotional mood (3-5 descriptive words)
2. Overall tone (single word like "ethereal", "dramatic", "playful", etc.)
3. Color palette (6 specific colors in hex format)
4. Visual elements (5-7 key visual components)
5. Art style (specific artistic style or movement)
6. Composition description (how elements are arranged)
7. Three detailed image generation prompts for a moodboard

Respond ONLY with a valid JSON object in this exact format:
{
  "mood": ["word1", "word2", "word3"],
  "tone": "single_word",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"],
  "visualElements": ["element1", "element2", "element3", "element4", "element5"],
  "artStyle": "specific art style",
  "composition": "detailed composition description",
  "imagePrompts": ["detailed prompt 1", "detailed prompt 2", "detailed prompt 3"]
}`,
          },
          {
            role: "user",
            content: `Analyze this creative description and create a comprehensive visual concept: "${englishPrompt}"`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    const concept = JSON.parse(content) as VisualConcept

    if (
      !concept.mood ||
      !concept.tone ||
      !concept.colorPalette ||
      !concept.visualElements ||
      !concept.artStyle ||
      !concept.composition ||
      !concept.imagePrompts
    ) {
      throw new Error("Invalid response structure")
    }

    return {
      ...concept,
      originalPrompt: detectedLang !== "en" ? prompt : undefined,
      detectedLanguage: detectedLang,
    }
  } catch (error) {
    console.error("Error generating visual concept:", error)

    return {
      mood: ["dreamy", "ethereal", "mystical"],
      tone: "serene",
      colorPalette: ["#FFD700", "#F4E4BC", "#E6E6FA", "#B19CD9", "#87CEEB", "#F0F8FF"],
      visualElements: ["flowing mist", "golden light", "silhouetted birds", "soft clouds", "gentle movement"],
      artStyle: "Impressionistic Digital Art",
      composition: "Horizontal composition with birds creating dynamic movement across a misty, golden landscape",
      imagePrompts: [
        "A dreamlike landscape bathed in golden light with ethereal mist swirling through the scene",
        "Silhouettes of birds in flight against a backdrop of soft, luminous clouds",
        "Abstract representation of movement and light with flowing, organic forms in gold and lavender tones",
      ],
    }
  }
}

export async function generateColorVariations(baseColors: string[]): Promise<string[][]> {
  const variations: string[][] = []

  const lighterColors = baseColors.map((color) => {
    const hex = color.replace("#", "")
    const r = Math.min(255, Number.parseInt(hex.substr(0, 2), 16) + 40)
    const g = Math.min(255, Number.parseInt(hex.substr(2, 2), 16) + 40)
    const b = Math.min(255, Number.parseInt(hex.substr(4, 2), 16) + 40)
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  })

  const darkerColors = baseColors.map((color) => {
    const hex = color.replace("#", "")
    const r = Math.max(0, Number.parseInt(hex.substr(0, 2), 16) - 40)
    const g = Math.max(0, Number.parseInt(hex.substr(2, 2), 16) - 40)
    const b = Math.max(0, Number.parseInt(hex.substr(4, 2), 16) - 40)
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  })

  variations.push(lighterColors, darkerColors)
  return variations
}
