"use client"

import { useState, useEffect, useCallback } from "react"
import { Eye, Mic, Sparkles, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PostGenerator() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState("")
  const [message, setMessage] = useState("")
  const [generatedPost, setGeneratedPost] = useState("")
  const [copied, setCopied] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Blink animation effect
  useEffect(() => {
    if (!mounted) return

    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 300)
    }, 600)

    return () => clearInterval(blinkInterval)
  }, [mounted])

  const generateAIPost = useCallback((topic: string, message: string) => {
    // This would be replaced with an actual AI call in a real application
    const hashtags = ["#X", "#Post", "#AI", "#Content"]

    // Add topic as hashtag if it exists
    if (topic) {
      const topicHashtag = "#" + topic.replace(/\s+/g, "")
      hashtags.push(topicHashtag)
    }

    // Select first 2 hashtags instead of random selection
    const selectedTags = hashtags.slice(0, 2).join(" ")

    // Create complete sentences for the post
    let postContent = ""

    if (message) {
      // Use the user's message as the base
      postContent = message.charAt(0).toUpperCase() + message.slice(1)
      // Ensure it ends with punctuation
      if (!postContent.match(/[.!?]$/)) {
        postContent += "."
      }
    } else {
      // Use a deterministic template based on topic
      const templateIndex = topic ? topic.length % 4 : 0
      const templates = [
        `Just discovered something amazing about ${topic || "this"}!`,
        `Here's a hot take on ${topic || "today's trends"}.`,
        `The future of ${topic || "innovation"} is here and it's exciting.`,
        `Can't believe what's happening with ${topic || "technology"} these days!`,
      ]
      postContent = templates[templateIndex]
    }

    // Combine content and hashtags, ensuring it's a complete thought
    const post = `${postContent} ${selectedTags}`

    // Ensure post is within character limit
    setGeneratedPost(post.length > 120 ? post.slice(0, 117) + "..." : post)
  }, [])

  // Handle step 3 auto-transition
  useEffect(() => {
    if (!mounted || step !== 3) return

    const timer = setTimeout(() => {
      // Only generate post if we have either topic or message
      if (topic || message) {
        generateAIPost(topic || "", message || "")
      }
      setStep(4)
    }, 2500)
    return () => clearTimeout(timer)
  }, [step, mounted, topic, message, generateAIPost])

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handleGeneratePost = () => {
    if (topic) {
      setStep(3)
    }
  }

  const handleRegeneratePost = () => {
    setStep(2)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {step === 1 && (
        <div className="text-center space-y-8 max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold">Now AI will generate X posts in a blink</h1>
          <div className="flex justify-center my-8">
            <Eye
              className={`h-16 w-16 text-blue-500 transition-all duration-300 ${mounted && isBlinking ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
            />
          </div>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-full text-lg"
            onClick={handleNextStep}
          >
            Let&apos;s go
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
            Now provide some more info, You can also use a voice bot to do it
          </h2>

          <div className="flex justify-center mb-6">
            <Button variant="ghost" className="rounded-full p-4 hover:bg-gray-800 relative">
              <Mic className="h-12 w-12 text-blue-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <span className="sr-only">Use voice input</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <div className="relative">
                <Input
                  id="topic"
                  placeholder="Enter your topic (e.g., Tech News, Motivation)"
                  className="bg-gray-900 border-gray-700 text-white"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                {!topic && <div className="absolute right-3 top-2.5 text-gray-500 text-xs">Type any topic</div>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Provide more details about your message. What you want to convey in the X post?"
                className="min-h-[120px] bg-gray-900 border-gray-700 placeholder:text-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleGeneratePost}
              disabled={!topic}
            >
              Generate Post
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-6">
          <Sparkles className="h-16 w-16 text-blue-500 animate-pulse mx-auto" />
          <h2 className="text-2xl font-semibold">AI is working on it yo</h2>
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-xl font-semibold text-center mb-4">Now all you need is to copy and paste below in X</h2>

          <Card className="bg-gray-900 border-gray-800 p-6 rounded-xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-lg font-bold">X</span>
                </div>
                <div>
                  <div className="font-semibold">AI Post Generator</div>
                  <div className="text-gray-400">@ai_post_gen</div>
                </div>
              </div>

              <p className="text-lg">{generatedPost}</p>

              <div className="flex items-center text-gray-500 text-sm">
                <span>Just now</span>
                <span className="mx-1">·</span>
                <span>X for Web</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>

            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleRegeneratePost}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

