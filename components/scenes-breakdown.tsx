"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Film, Eye, Copy, Palette, Sparkles, ChevronDown, ChevronUp, ImageIcon } from "lucide-react"

interface Scene {
  id: string
  title: string
  description: string
  visualPrompt: string
  mood: string[]
  dominantColors: string[]
  keyElements: string[]
}

interface ScenesBreakdownProps {
  scenes: Scene[]
  isGenerating: boolean
  onGenerate: () => void
}

export function ScenesBreakdown({ scenes, isGenerating, onGenerate }: ScenesBreakdownProps) {
  const [expandedScenes, setExpandedScenes] = useState<string[]>([])

  const toggleScene = (sceneId: string) => {
    setExpandedScenes((prev) => (prev.includes(sceneId) ? prev.filter((id) => id !== sceneId) : [...prev, sceneId]))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  if (scenes.length === 0) {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5 text-orange-600" />
            Scene Breakdown
          </CardTitle>
          <p className="text-sm text-gray-600">
            Break your concept into distinct scenes or themes, each with its own visual focus and generated image
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating Scenes...
              </>
            ) : (
              <>
                <Film className="h-4 w-4 mr-2" />
                Generate Scene Breakdown
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5 text-orange-600" />
          Scene Breakdown
          <Badge variant="secondary" className="ml-auto">
            {scenes.length} Scenes
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">Your concept broken into distinct visual scenes with generated visuals</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scenes.map((scene, index) => (
            <Card key={scene.id} className="border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-orange-800">{scene.title}</CardTitle>
                      <p className="text-sm text-orange-600">{scene.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleScene(scene.id)}>
                    {expandedScenes.includes(scene.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {/* Scene Visual Preview */}
              <CardContent className="pt-0 pb-4">
                <div className="mb-4 p-4 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center justify-center h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">Scene {index + 1} Visual</p>
                      <p className="text-xs text-gray-400 mt-1">Generated image would appear here</p>
                    </div>
                  </div>
                </div>

                {expandedScenes.includes(scene.id) && (
                  <div className="space-y-4">
                    {/* Visual Prompt */}
                    <div className="p-4 bg-white rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Visual Prompt
                        </h4>
                        <Button
                          onClick={() => copyToClipboard(scene.visualPrompt)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scene.visualPrompt}</p>
                    </div>

                    {/* Scene Details */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Mood */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          Mood
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {scene.mood.map((mood, moodIndex) => (
                            <Badge
                              key={moodIndex}
                              variant="secondary"
                              className="text-xs bg-orange-100 text-orange-800"
                            >
                              {mood}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800 flex items-center gap-1">
                          <Palette className="h-4 w-4" />
                          Colors
                        </h4>
                        <div className="flex gap-1">
                          {scene.dominantColors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded border cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: color }}
                              title={color}
                              onClick={() => copyToClipboard(color)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Key Elements */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">Key Elements</h4>
                        <div className="space-y-1">
                          {scene.keyElements.map((element, elementIndex) => (
                            <div key={elementIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                              <span className="text-xs text-gray-700">{element}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate More Scenes Button */}
        <Button onClick={onGenerate} disabled={isGenerating} variant="outline" className="w-full mt-4">
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
              Regenerating Scenes...
            </>
          ) : (
            <>
              <Film className="h-4 w-4 mr-2" />
              Regenerate Scenes
            </>
          )}
        </Button>

        {/* Scene Tips */}
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <h5 className="font-medium text-orange-800 mb-2">💡 Scene Tips</h5>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Each scene represents a different aspect or moment of your concept</li>
            <li>• Use the visual prompts to generate images for each scene</li>
            <li>• Copy individual prompts to create a cohesive visual story</li>
            <li>• Scenes can be used for storyboards, mood boards, or art series</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
