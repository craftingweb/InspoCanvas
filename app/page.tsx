"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Palette, Sparkles, Eye, Volume2, Copy, Globe, Languages } from "lucide-react"
import { generateVisualConcept, generateColorVariations, detectLanguage, generateLearningTips } from "./actions"
import { LearningTips } from "@/components/learning-tips"

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

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

export default function InspoCanvas() {
  const [prompt, setPrompt] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [visualConcept, setVisualConcept] = useState<VisualConcept | null>(null)
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet-v2")
  const [selectedLanguage, setSelectedLanguage] = useState("auto")
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  const [colorVariations, setColorVariations] = useState<string[][]>([])
  const [conceptHistory, setConceptHistory] = useState<VisualConcept[]>([])
  const [learningTips, setLearningTips] = useState<any[]>([])

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false

      if (selectedLanguage !== "auto") {
        const langMap: { [key: string]: string } = {
          en: "en-US",
          es: "es-ES",
          fr: "fr-FR",
          de: "de-DE",
          it: "it-IT",
          pt: "pt-PT",
          ru: "ru-RU",
          ja: "ja-JP",
          ko: "ko-KR",
          zh: "zh-CN",
          uk: "uk-UA",
          ar: "ar-SA",
        }
        recognition.lang = langMap[selectedLanguage] || "en-US"
      } else {
        recognition.lang = "en-US"
      }

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setPrompt((prev) => prev + (prev ? " " : "") + transcript)
      }

      recognition.start()
    } else {
      alert("Speech recognition not supported in this browser")
    }
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const handleLanguageDetection = async () => {
    if (!prompt.trim()) return

    setIsTranslating(true)
    try {
      const detected = await detectLanguage(prompt)
      setDetectedLanguage(detected)
    } catch (error) {
      console.error("Error detecting language:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      const concept = await generateVisualConcept(prompt, selectedLanguage !== "auto" ? selectedLanguage : undefined)
      setVisualConcept(concept)

      if (concept.detectedLanguage) {
        setDetectedLanguage(concept.detectedLanguage)
      }

      const tips = await generateLearningTips(concept)
      setLearningTips(tips)

      setConceptHistory((prev) => [concept, ...prev.slice(0, 4)])

      const variations = await generateColorVariations(concept.colorPalette)
      setColorVariations(variations)
    } catch (error) {
      console.error("Error generating concept:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const sharePrompts = () => {
    if (!visualConcept) return

    const shareText = `InspoCanvas Visual Concept:\n\n${visualConcept.imagePrompts.join("\n\n")}`

    if (navigator.share) {
      navigator.share({
        title: "InspoCanvas Visual Concept",
        text: shareText,
      })
    } else {
      copyToClipboard(shareText)
      alert("Concept prompts copied to clipboard!")
    }
  }

  const getLanguageName = (code: string) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code)
    return lang ? `${lang.flag} ${lang.name}` : code
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              InspoCanvas
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your creative stories into detailed visual concepts. Speak or type in any language - we'll
            understand your vision.
          </p>
        </div>

        {/* Input Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Describe Your Vision
              <Globe className="h-4 w-4 text-gray-500" />
            </CardTitle>
            {visualConcept?.originalPrompt && (
              <div className="mt-2">
                <Badge variant="secondary">
                  Translated from {getLanguageName(visualConcept.detectedLanguage || "unknown")}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Describe your creative vision in any language... e.g., 'un paisaje de ensueño en oro con pájaros volando a través de la niebla' or '金色の霧の中を鳥が飛ぶ夢のような風景'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 text-lg resize-none pr-20"
                aria-label="Creative prompt input"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLanguageDetection}
                  disabled={!prompt.trim() || isTranslating}
                  title="Detect language"
                >
                  {isTranslating ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600" />
                  ) : (
                    <Languages className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isListening && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="text-sm">
                  Listening in {selectedLanguage === "auto" ? "Auto-detect" : getLanguageName(selectedLanguage)}...
                </span>
              </div>
            )}

            {detectedLanguage && detectedLanguage !== "en" && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Detected language: <strong>{getLanguageName(detectedLanguage)}</strong>
                  {visualConcept?.originalPrompt && " - Automatically translated to English for processing"}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="language-select" className="text-sm font-medium whitespace-nowrap">
                  Input Language:
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
                >
                  <option value="auto">🌐 Auto-detect</option>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="model-select" className="text-sm font-medium whitespace-nowrap">
                  AI Model:
                </label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
                >
                  <option value="claude-3-5-sonnet-v2">Claude 3.5 Sonnet v2</option>
                  <option value="deepseek-r1-v1">DeepSeek R1</option>
                  <option value="llama-4-maverick-17b-instruct">Llama 4 Maverick</option>
                  <option value="claude-3-5-haiku">Claude 3.5 Haiku</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Visual Concept...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Visual Concept
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {visualConcept && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Mood & Tone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Mood & Atmosphere
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      speakText(`The mood is ${visualConcept.mood.join(", ")} with a ${visualConcept.tone} tone.`)
                    }
                    aria-label="Read mood and tone aloud"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Emotional Mood:</h4>
                    <div className="flex flex-wrap gap-2">
                      {visualConcept.mood.map((mood, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Overall Tone:</h4>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {visualConcept.tone}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Color Palette with Variations */}
            <Card>
              <CardHeader>
                <CardTitle>Color Palette & Variations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Main Palette:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {visualConcept.colorPalette.map((color, index) => (
                      <div
                        key={index}
                        className="text-center group cursor-pointer"
                        onClick={() => copyToClipboard(color)}
                      >
                        <div
                          className="w-full h-20 rounded-lg shadow-md mb-2 transition-transform group-hover:scale-105"
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${color}`}
                        />
                        <p className="text-sm font-medium">{color}</p>
                        <p className="text-xs text-gray-500">Click to copy</p>
                      </div>
                    ))}
                  </div>
                </div>

                {colorVariations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Color Variations:</h4>
                    {colorVariations.map((variation, varIndex) => (
                      <div key={varIndex}>
                        <h5 className="text-sm font-medium mb-2 text-gray-600">
                          {varIndex === 0 ? "Lighter Tones" : "Darker Tones"}
                        </h5>
                        <div className="flex gap-2 overflow-x-auto">
                          {variation.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="flex-shrink-0 w-12 h-12 rounded cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: color }}
                              title={color}
                              onClick={() => copyToClipboard(color)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visual Elements & Style */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Elements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {visualConcept.visualElements.map((element, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        <span>{element}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Art Style & Composition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Style:</h4>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {visualConcept.artStyle}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Composition:</h4>
                    <p className="text-gray-700">{visualConcept.composition}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Concept Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Concept Prompts</span>
                  <Button onClick={sharePrompts} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visualConcept.imagePrompts.map((imagePrompt, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-800">Prompt {index + 1}</h4>
                        <Button
                          onClick={() => copyToClipboard(imagePrompt)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{imagePrompt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Concept History */}
            {conceptHistory.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {conceptHistory.slice(1, 4).map((concept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {concept.colorPalette.slice(0, 3).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{concept.artStyle}</span>
                          <Badge variant="secondary" className="text-xs">
                            {concept.tone}
                          </Badge>
                          {concept.detectedLanguage && concept.detectedLanguage !== "en" && (
                            <Badge variant="outline" className="text-xs">
                              {getLanguageName(concept.detectedLanguage)}
                            </Badge>
                          )}
                        </div>
                        <Button onClick={() => setVisualConcept(concept)} size="sm" variant="outline">
                          Use This
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Tips - At the very bottom */}
            {learningTips.length > 0 && (
              <div className="max-w-6xl mx-auto">
                <LearningTips tips={learningTips} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
