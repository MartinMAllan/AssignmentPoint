"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/frontend/hooks/use-toast"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
}

interface FileUploadDropzoneProps {
  onFilesSelected: (files: UploadedFile[]) => void
  uploadedFiles?: UploadedFile[]
  maxFiles?: number
  maxFileSize?: number // in MB
  allowedFileTypes?: string[]
  label?: string
  description?: string
}

export function FileUploadDropzone({
  onFilesSelected,
  uploadedFiles = [],
  maxFiles = 10,
  maxFileSize = 50,
  allowedFileTypes = ["doc", "docx", "pdf", "ppt", "pptx", "xls", "xlsx", "txt"],
  label = "Upload Files",
  description,
}: FileUploadDropzoneProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return {
        valid: false,
        error: `File size must be less than ${maxFileSize}MB. ${file.name} is ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      }
    }

    // Check file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (fileExtension && !allowedFileTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type .${fileExtension} is not allowed. Allowed types: ${allowedFileTypes.join(", ")}`,
      }
    }

    return { valid: true }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file) => {
      const validation = validateFile(file)

      if (!validation.valid) {
        toast({
          title: "File Error",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      // Check if file already uploaded
      if (uploadedFiles.some((f) => f.name === file.name && f.size === file.size)) {
        toast({
          title: "Duplicate File",
          description: `${file.name} is already uploaded`,
          variant: "destructive",
        })
        return
      }

      // Check max files limit
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        toast({
          title: "File Limit Reached",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        })
        return
      }

      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      })
    })

    if (newFiles.length > 0) {
      onFilesSelected([...uploadedFiles, ...newFiles])
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) added successfully`,
      })
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [uploadedFiles],
  )

  const removeFile = (fileId: string) => {
    onFilesSelected(uploadedFiles.filter((f) => f.id !== fileId))
    toast({
      title: "File Removed",
      description: "File has been removed from upload list",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-slate-200 font-medium">{label}</label>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5 cursor-grab"
            : "border-slate-700 hover:border-slate-600 cursor-pointer"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
          accept={allowedFileTypes.map((type) => `.${type}`).join(",")}
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">
            <span className="text-primary hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supported: {allowedFileTypes.join(", ").toUpperCase()} (Max {maxFileSize}MB per file)
          </p>
        </label>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-200 mb-4">
                Uploaded Files ({uploadedFiles.length}/{maxFiles})
              </p>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-500/10 rounded flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-slate-400 hover:text-red-400 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      {uploadedFiles.length >= maxFiles && (
        <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-400">Maximum file limit reached. Remove a file to add another.</p>
        </div>
      )}
    </div>
  )
}
