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

  const handleNextStep = () => {
    setStep(2)
  }

  const handleGeneratePost = async () => {
    setStep(3)

    try {
      const res = await fetch("https://eoitaalcvmrtlrk.m.pipedream.net", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic, message })
      });

      const data = await res.text();
      console.log("Claude returned:", data);
      setGeneratedPost(data);
    } catch (error) {
      setGeneratedPost("Error generating post.");
    } finally {
      setStep(4);
    }
  };

  const handleRegeneratePost = () => {
    setStep(2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setMounted(true)
    const blink = setInterval(() => {
      setIsBlinking((prevIsBlinking) => !prevIsBlinking);
    }, 500);

    return () => {
      clearInterval(blink);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {step === 1 && (
        <div className="text-center space-y-8 max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Now AI will generate X posts in a blink</h1>
          <div className="flex justify-center my-8">
            <Eye
              className={`h-16 w-16 text-[#1DA1F2] transition-all duration-300 ${mounted && isBlinking ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
            />
          </div>
          <Button
            className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-8 py-6 rounded-full text-lg font-bold"
            onClick={handleNextStep}
          >
            Let&apos;s go
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-white">
            Now provide some more info, You can also use a voice bot to do it
          </h2>

          <div className="flex justify-center mb-6">
            <Button variant="ghost" className="rounded-full p-4 hover:bg-[#181818] relative">
              <Mic className="h-12 w-12 text-[#1DA1F2] animate-pulse" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#1DA1F2] rounded-full"></span>
            </Button>
            <span className="sr-only">Use voice input</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-white">Topic</Label>
              <div className="relative">
                <Input
                  id="topic"
                  placeholder="Enter your topic (e.g., Tech News, Motivation)"
                  className="bg-[#181818] border-[#2F3336] text-white placeholder:text-[#71767B] focus:border-[#1DA1F2] focus:ring-[#1DA1F2]"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                {!topic && <div className="absolute right-3 top-2.5 text-[#71767B] text-xs">Type any topic</div>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Provide more details about your message. What you want to convey in the X post?"
                className="min-h-[120px] bg-[#181818] border-[#2F3336] placeholder:text-[#71767B] focus:border-[#1DA1F2] focus:ring-[#1DA1F2] text-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold"
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
          <Sparkles className="h-16 w-16 text-[#1DA1F2] animate-pulse mx-auto" />
          <h2 className="text-2xl font-bold text-white">AI is working on it yo</h2>
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-xl font-bold text-center mb-4 text-white">Now all you need is to copy and paste below in X</h2>

          <Card className="bg-[#181818] border-[#2F3336] p-6 rounded-xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">X</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-[15px] leading-[20px]">{generatedPost}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1DA1F2] hover:bg-[#181818]"
                  onClick={handleRegeneratePost}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1DA1F2] hover:bg-[#181818]"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
