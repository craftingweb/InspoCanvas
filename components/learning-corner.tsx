"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Palette, Layout, Brush, ChevronDown, ChevronUp, Lightbulb } from "lucide-react"

interface LearningSection {
  id: string
  title: string
  icon: React.ReactNode
  content: {
    title: string
    description: string
    examples: string[]
    tips: string[]
  }[]
}

const LEARNING_SECTIONS: LearningSection[] = [
  {
    id: "composition",
    title: "Composition",
    icon: <Layout className="h-5 w-5" />,
    content: [
      {
        title: "Rule of Thirds",
        description:
          "Divide your canvas into nine equal sections and place important elements along these lines or at their intersections.",
        examples: [
          "Place horizons on the upper or lower third line",
          "Position subjects at intersection points",
          "Use vertical thirds for portraits",
        ],
        tips: [
          "Avoid centering everything - it can look static",
          "Use the rule as a guide, not a strict requirement",
          "Break the rule intentionally for dramatic effect",
        ],
      },
      {
        title: "Leading Lines",
        description:
          "Use lines within your composition to guide the viewer's eye toward your main subject or focal point.",
        examples: [
          "Rivers, roads, or paths leading to a subject",
          "Architectural elements like stairs or railings",
          "Natural formations like rock edges or tree branches",
        ],
        tips: [
          "Diagonal lines create more dynamic energy",
          "Curved lines feel more natural and organic",
          "Converging lines create depth and perspective",
        ],
      },
      {
        title: "Framing",
        description:
          "Use elements in your scene to create a natural frame around your subject, drawing attention and adding depth.",
        examples: [
          "Tree branches framing a landscape",
          "Architectural elements like doorways or windows",
          "Natural formations like cave openings",
        ],
        tips: [
          "Frames don't need to be complete circles or rectangles",
          "Use shadows and light to create subtle frames",
          "Multiple layers of framing add complexity",
        ],
      },
    ],
  },
  {
    id: "color",
    title: "Color Theory",
    icon: <Palette className="h-5 w-5" />,
    content: [
      {
        title: "Color Harmony",
        description:
          "Certain color combinations naturally work well together and create pleasing visual relationships.",
        examples: [
          "Complementary: Colors opposite on the color wheel (red/green, blue/orange)",
          "Analogous: Colors next to each other (blue, blue-green, green)",
          "Triadic: Three colors evenly spaced on the wheel",
        ],
        tips: [
          "Use 60-30-10 rule: 60% dominant, 30% secondary, 10% accent",
          "Warm colors advance, cool colors recede",
          "Desaturated colors create calm, saturated colors create energy",
        ],
      },
      {
        title: "Color Temperature",
        description: "Colors have psychological and visual 'temperatures' that affect mood and spatial perception.",
        examples: [
          "Warm colors: Reds, oranges, yellows - feel energetic and close",
          "Cool colors: Blues, greens, purples - feel calm and distant",
          "Neutral colors: Grays, browns, beiges - provide balance",
        ],
        tips: [
          "Use warm colors for focal points",
          "Cool colors work well for backgrounds",
          "Mix warm and cool for visual interest",
        ],
      },
      {
        title: "Color Psychology",
        description: "Colors evoke specific emotions and associations that can enhance your artistic message.",
        examples: [
          "Red: Passion, energy, danger, love",
          "Blue: Calm, trust, sadness, professionalism",
          "Green: Nature, growth, harmony, freshness",
          "Purple: Luxury, creativity, mystery, spirituality",
        ],
        tips: [
          "Consider cultural color associations",
          "Use color to support your concept's mood",
          "Subtle color shifts can change entire meanings",
        ],
      },
    ],
  },
  {
    id: "styles",
    title: "Artistic Styles",
    icon: <Brush className="h-5 w-5" />,
    content: [
      {
        title: "Impressionism",
        description:
          "Focuses on capturing light and its changing qualities, often with visible brushstrokes and pure color.",
        examples: [
          "Loose, visible brushwork",
          "Emphasis on light and atmosphere",
          "Outdoor scenes and natural lighting",
          "Pure colors mixed optically rather than on palette",
        ],
        tips: [
          "Focus on the overall impression rather than details",
          "Use broken color technique for vibrancy",
          "Paint quickly to capture fleeting light",
        ],
      },
      {
        title: "Minimalism",
        description:
          "Uses simple forms, limited colors, and clean lines to create maximum impact with minimal elements.",
        examples: [
          "Limited color palettes (often monochromatic)",
          "Simple geometric shapes",
          "Lots of negative space",
          "Clean, uncluttered compositions",
        ],
        tips: [
          "Every element should have a purpose",
          "Use negative space as an active element",
          "Focus on perfect proportions and balance",
        ],
      },
      {
        title: "Abstract Expressionism",
        description:
          "Emphasizes spontaneous, emotional expression through color, form, and gesture rather than realistic representation.",
        examples: [
          "Bold, gestural brushstrokes",
          "Large-scale canvases",
          "Non-representational forms",
          "Emphasis on the act of painting itself",
        ],
        tips: [
          "Let emotion guide your mark-making",
          "Experiment with unconventional tools",
          "Focus on color and form relationships",
        ],
      },
      {
        title: "Photorealism",
        description:
          "Creates artworks that closely resemble high-resolution photographs, emphasizing technical precision.",
        examples: [
          "Extremely detailed rendering",
          "Precise color matching",
          "Sharp focus throughout",
          "Often based on photographic references",
        ],
        tips: [
          "Work from high-quality reference photos",
          "Build up details gradually in layers",
          "Pay attention to subtle color variations",
        ],
      },
    ],
  },
]

export function LearningCorner() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("composition")

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const activeSection = LEARNING_SECTIONS.find((section) => section.id === activeTab)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Learning Corner
        </CardTitle>
        <p className="text-sm text-gray-600">Expand your creative knowledge with these fundamental art concepts</p>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {LEARNING_SECTIONS.map((section) => (
            <Button
              key={section.id}
              variant={activeTab === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(section.id)}
              className="mb-2"
            >
              {section.icon}
              <span className="ml-2">{section.title}</span>
            </Button>
          ))}
        </div>

        {/* Active Section Content */}
        {activeSection && (
          <div className="space-y-4">
            {activeSection.content.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => toggleSection(`${activeTab}-${index}`)}>
                      {expandedSections.includes(`${activeTab}-${index}`) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardHeader>

                {expandedSections.includes(`${activeTab}-${index}`) && (
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Examples:</h4>
                        <ul className="space-y-1">
                          {item.examples.map((example, exIndex) => (
                            <li key={exIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-700">Tips:</h4>
                        <ul className="space-y-1">
                          {item.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              <Lightbulb className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
