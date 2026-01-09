"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { FileText, AlertCircle, Clock, ArrowLeft, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { FileUploadDropzone, type UploadedFile } from "@/components/file-upload-dropzone"
import { orderService } from "@/lib/api/order.service"
import type { Order } from "@/lib/types"

export default function SubmitOrderPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [order, setOrder] = useState<Order | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [submissionNote, setSubmissionNote] = useState("")
  const [confirmations, setConfirmations] = useState({
    requirements: false,
    plagiarism: false,
    quality: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const orderData = await orderService.getOrderById(Number(params.id))
        setOrder(orderData)
      } catch (err) {
        console.error("[v0] Error loading order:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadOrder()
    }
  }, [params.id])

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload at least one file before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!confirmations.requirements || !confirmations.plagiarism || !confirmations.quality) {
      toast({
        title: "Confirmations Required",
        description: "Please confirm all requirements before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In real app: await orderService.submitWork(order.id, formData)
      toast({
        title: "Order Submitted Successfully",
        description: "Your work has been submitted for review.",
      })
      router.push(`/orders/${params.id}`)
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit work",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Loading order...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (user?.role !== "writer") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Access denied</p>
        </div>
      </DashboardLayout>
    )
  }

  const writerShare = order.totalAmount * 0.4

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Submit Completed Work</h1>
            <p className="text-slate-400">Upload your final deliverables and submit for review</p>
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-slate-100">{order.title}</CardTitle>
                <p className="text-slate-400 text-sm mt-1">Order #{order.orderNumber}</p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">In Progress</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Deadline</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-slate-200 font-medium">
                    {format(new Date(order.deadline), "MMM dd, HH:mm a")}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Your Earnings</p>
                <p className="text-2xl font-bold text-green-500">${writerShare.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Final Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploadDropzone
              label="Final Deliverables"
              description="Upload your completed work files"
              onFilesSelected={setUploadedFiles}
              uploadedFiles={uploadedFiles}
              maxFiles={15}
              maxFileSize={50}
              allowedFileTypes={["doc", "docx", "pdf", "ppt", "pptx", "xls", "xlsx", "txt", "zip"]}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Submission Note (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any notes or explanations for the customer..."
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              className="min-h-[120px] bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Final Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="requirements"
                checked={confirmations.requirements}
                onCheckedChange={(checked) => setConfirmations({ ...confirmations, requirements: checked as boolean })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="requirements" className="text-slate-200 font-medium cursor-pointer">
                  All Requirements Met
                </Label>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="plagiarism"
                checked={confirmations.plagiarism}
                onCheckedChange={(checked) => setConfirmations({ ...confirmations, plagiarism: checked as boolean })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="plagiarism" className="text-slate-200 font-medium cursor-pointer">
                  Original Work
                </Label>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="quality"
                checked={confirmations.quality}
                onCheckedChange={(checked) => setConfirmations({ ...confirmations, quality: checked as boolean })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="quality" className="text-slate-200 font-medium cursor-pointer">
                  Quality Assured
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 h-12 text-base"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Work for Review"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
