"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Share2, Heart, MessageCircle, Copy, Users, Send, Clock } from "lucide-react"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  type: "comment" | "heart"
}

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
  id?: string
  createdAt?: string
  sharedBy?: string
  comments?: Comment[]
  hearts?: number
}

interface CollaborationPanelProps {
  concept: VisualConcept
  prompt: string
  onShare: (concept: VisualConcept, prompt: string) => Promise<string>
  onAddComment: (conceptId: string, comment: Comment) => Promise<boolean>
  onAddHeart: (conceptId: string) => Promise<boolean>
}

export function CollaborationPanel({ concept, prompt, onShare, onAddComment, onAddHeart }: CollaborationPanelProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [localHearts, setLocalHearts] = useState(concept.hearts || 0)
  const [localComments, setLocalComments] = useState<Comment[]>(concept.comments || [])

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const link = await onShare(concept, prompt)
      setShareLink(link)
    } catch (error) {
      console.error("Error sharing concept:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      alert("Share link copied to clipboard!")
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !concept.id) return

    setIsAddingComment(true)
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      author: "You", // In a real app, this would be the current user
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      type: "comment",
    }

    try {
      const success = await onAddComment(concept.id, comment)
      if (success) {
        setLocalComments((prev) => [comment, ...prev])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsAddingComment(false)
    }
  }

  const handleAddHeart = async () => {
    if (!concept.id || hasLiked) return

    try {
      const success = await onAddHeart(concept.id)
      if (success) {
        setLocalHearts((prev) => prev + 1)
        setHasLiked(true)
      }
    } catch (error) {
      console.error("Error adding heart:", error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Collaboration & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Share Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Share Your Canvas</h4>
          <div className="flex gap-2">
            <Button onClick={handleShare} disabled={isSharing} className="flex-1">
              {isSharing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Link...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Canvas
                </>
              )}
            </Button>
            {shareLink && (
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
          {shareLink && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 mb-2">
                <strong>Canvas shared successfully!</strong>
              </p>
              <p className="text-xs text-green-600 break-all font-mono bg-white p-2 rounded border">{shareLink}</p>
            </div>
          )}
        </div>

        {/* Engagement Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Community Feedback</h4>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddHeart}
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              disabled={hasLiked}
              className={hasLiked ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${hasLiked ? "fill-white" : ""}`} />
              {localHearts} {localHearts === 1 ? "Heart" : "Hearts"}
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {localComments.length} {localComments.length === 1 ? "Comment" : "Comments"}
            </Badge>
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Leave Feedback</h4>
          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts on this visual concept..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 resize-none"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim() || isAddingComment} size="sm">
              {isAddingComment ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {localComments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Recent Comments</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {localComments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm text-gray-800">{comment.author}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(comment.timestamp)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Tips */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">💡 Collaboration Tips</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Share your canvas to get feedback from other artists</li>
            <li>• Leave constructive comments to help others improve</li>
            <li>• Use hearts to show appreciation for inspiring concepts</li>
            <li>• Ask specific questions about techniques or color choices</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
