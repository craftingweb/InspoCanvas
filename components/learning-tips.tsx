"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Palette, Layout, Brush } from "lucide-react"

interface LearningTip {
  id: string
  category: "composition" | "color" | "style"
  title: string
  content: string
  example?: string
  relatedConcepts?: string[]
}

interface LearningTipsProps {
  tips: LearningTip[]
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "composition":
      return <Layout className="h-4 w-4" />
    case "color":
      return <Palette className="h-4 w-4" />
    case "style":
      return <Brush className="h-4 w-4" />
    default:
      return <Lightbulb className="h-4 w-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "composition":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "color":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "style":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function LearningTips({ tips }: LearningTipsProps) {
  if (!tips || tips.length === 0) return null

  return (
    <Card className="border-l-4 border-l-yellow-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Learning Tips
          <Badge variant="secondary" className="ml-auto">
            Based on your concept
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div key={tip.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getCategoryColor(tip.category)}`}>
                  {getCategoryIcon(tip.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {tip.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{tip.content}</p>
                  {tip.example && (
                    <div className="p-2 bg-white rounded border-l-2 border-yellow-400">
                      <p className="text-xs text-gray-600">
                        <strong>Example:</strong> {tip.example}
                      </p>
                    </div>
                  )}
                  {tip.relatedConcepts && tip.relatedConcepts.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tip.relatedConcepts.map((concept, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
