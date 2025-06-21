"use client"
import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FallbackEditor from "@/components/images/fallback-editor"
import Link from 'next/link';
import { Input } from "@/components/ui/input"

// Dynamically import components that use browser APIs
const ImageEditor = dynamic(() => import("@/components/images/image-editor"), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading WebGL editor...</div>,
})

const ScriptLoader = dynamic(() => import("@/components/images/script-loader"), { ssr: false })

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-900 text-white">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <Link href="/"><h1 className="text-4xl font-bold mb-2">Image Editor</h1></Link>
          <p className="text-lg text-gray-300">Edit your images with filters and effects</p>
        </div>

        <Card className="bg-gray-200 text-gray-900">
          <CardHeader>
           <CardTitle className="text-center">Image Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {!imageUrl ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-400 rounded-lg">
                <p className="mb-4 text-gray-600">Upload an image to get started</p>
                <Button onClick={() => fileInputRef.current?.click()}>Select Image</Button>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="standard" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="standard">Standard Editor</TabsTrigger>
                    {/* <TabsTrigger value="webgl">WebGL Editor</TabsTrigger> */}
                  </TabsList>
                  <TabsContent value="standard">
                    <div className="relative">
                      <FallbackEditor imageUrl={imageUrl} />
                      <div className="absolute bottom-2 right-2">
                        <Button variant="secondary" size="sm" onClick={() => setImageUrl(null)}>
                          Change Image
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  {/* <TabsContent value="webgl">
                    <ScriptLoader fallback={<FallbackEditor imageUrl={imageUrl} />}>
                      <div className="relative">
                        <ImageEditor imageUrl={imageUrl} />
                        <div className="absolute bottom-2 right-2">
                          <Button variant="secondary" size="sm" onClick={() => setImageUrl(null)}>
                            Change Image
                          </Button>
                        </div>
                      </div>
                    </ScriptLoader>
                  </TabsContent> */}
                </Tabs>

                <div className="p-4 bg-yellow-100 rounded-lg text-yellow-800">
                  <p className="text-sm">
                    <strong>Tip:</strong>use the Standard
                    Editor which has better compatibility across browsers.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 text-center text-gray-500">
        Created for <Link href="http://jsdev.space">cricketON </Link>
        </footer>
    </main>
  )
}

