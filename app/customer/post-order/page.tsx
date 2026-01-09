"use client"

import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { orderService } from "@/lib/api/order.service"
import { useToast } from "@/hooks/use-toast"
import { FileUploadDropzone, type UploadedFile } from "@/components/file-upload-dropzone"

export default function PostOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    educationLevel: "",
    type: "",
    pages: "",
    words: "",
    sources: "",
    citationStyle: "",
    spacing: "",
    deadline: "",
    deliveryTime: "",
    description: "",
    budget: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const orderData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        educationLevel: formData.educationLevel,
        subject: formData.subject,
        pages: Number.parseInt(formData.pages),
        words: Number.parseInt(formData.words),
        sourcesRequired: Number.parseInt(formData.sources),
        citationStyle: formData.citationStyle,
        spacing: formData.spacing,
        totalAmount: Number.parseFloat(formData.budget),
        deadline: formData.deadline,
        deliveryTime: Number.parseInt(formData.deliveryTime),
      }

      if (uploadedFiles.length > 0) {
        const formDataWithFiles = new FormData()
        Object.entries(orderData).forEach(([key, value]) => {
          formDataWithFiles.append(key, String(value))
        })
        uploadedFiles.forEach((uploadedFile) => {
          formDataWithFiles.append("files", uploadedFile.file)
        })

        await orderService.createOrderWithFiles(formDataWithFiles)
      } else {
        await orderService.createOrder(orderData)
      }

      toast({
        title: "Order Posted Successfully",
        description: "Your order is now available for writers to bid on.",
      })

      router.push("/customer/orders?status=available")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Post New Order</h1>
          <p className="text-slate-400 mt-1">Fill in the details and writers will bid on your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-200">
                  Order Title *
                </Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g., Nursing Case Study on Patient Care"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-200">
                    Subject *
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Nursing">Nursing</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel" className="text-slate-200">
                    Education Level *
                  </Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Bachelor">Bachelor</SelectItem>
                      <SelectItem value="Masters">Masters</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-200">
                    Type *
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Essay">Essay</SelectItem>
                      <SelectItem value="Research Paper">Research Paper</SelectItem>
                      <SelectItem value="Case Study">Case Study</SelectItem>
                      <SelectItem value="PowerPoint Presentation">PowerPoint Presentation</SelectItem>
                      <SelectItem value="Dissertation">Dissertation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citationStyle" className="text-slate-200">
                    Citation Style *
                  </Label>
                  <Select
                    value={formData.citationStyle}
                    onValueChange={(value) => setFormData({ ...formData, citationStyle: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="APA 7th">APA 7th</SelectItem>
                      <SelectItem value="MLA">MLA</SelectItem>
                      <SelectItem value="Chicago">Chicago</SelectItem>
                      <SelectItem value="Harvard">Harvard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages" className="text-slate-200">
                    Pages/Slides *
                  </Label>
                  <Input
                    id="pages"
                    type="number"
                    required
                    placeholder="10"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="words" className="text-slate-200">
                    Word Count *
                  </Label>
                  <Input
                    id="words"
                    type="number"
                    required
                    placeholder="2500"
                    value={formData.words}
                    onChange={(e) => setFormData({ ...formData, words: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sources" className="text-slate-200">
                    Sources Required *
                  </Label>
                  <Input
                    id="sources"
                    type="number"
                    required
                    placeholder="5"
                    value={formData.sources}
                    onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-slate-200">
                    Deadline *
                  </Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime" className="text-slate-200">
                    Expected Delivery Time (Hours) *
                  </Label>
                  <Input
                    id="deliveryTime"
                    type="number"
                    required
                    placeholder="48"
                    min="1"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                  <p className="text-xs text-slate-400">How many hours the writer has to complete the work</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spacing" className="text-slate-200">
                    Spacing *
                  </Label>
                  <Select
                    value={formData.spacing}
                    onValueChange={(value) => setFormData({ ...formData, spacing: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select spacing" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-slate-200">
                    Budget (USD) *
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    required
                    placeholder="100"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">
                  Description/Instructions *
                </Label>
                <Textarea
                  id="description"
                  required
                  placeholder="Provide detailed instructions for the order..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>

              <FileUploadDropzone
                label="Attachments (Optional)"
                description="Upload reference materials, rubrics, templates, or any other files the writers need to complete your order"
                onFilesSelected={setUploadedFiles}
                uploadedFiles={uploadedFiles}
                maxFiles={10}
                maxFileSize={50}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting Order...
                    </>
                  ) : (
                    "Post Order & Receive Bids"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
