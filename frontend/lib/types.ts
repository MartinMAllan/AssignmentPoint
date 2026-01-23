// User roles
export type UserRole = "writer" | "admin" | "writer_manager" | "customer" | "sales_agent" | "editor"

// Order status types
export type OrderStatus =
  | "pending"
  | "available"
  | "in_progress"
  | "in_review"
  | "revision"
  | "completed"
  | "canceled"
  | "disputed"

// User interface
export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string
  profileImage?: string
  isActive: boolean
  createdAt: Date
}

// Writer interface
export interface Writer extends User {
  role: "writer"
  writerManagerId?: string
  rating: number
  totalOrdersCompleted: number
  successRate: number
  specializations: string[]
  availabilityStatus: "available" | "busy" | "unavailable"
  walletBalance: number
}

// Customer interface
export interface Customer extends User {
  role: "customer"
  salesAgentId?: string
  referralCodeUsed?: string
  isReturning: boolean
  totalOrders: number
  totalSpent: number
}

// Sales Agent interface
export interface SalesAgent extends User {
  role: "sales_agent"
  referralCode: string
  totalReferrals: number
  activeCustomers: number
  walletBalance: number
}

// Editor interface
export interface Editor extends User {
  role: "editor"
  totalOrdersEdited: number
  walletBalance: number
}

// Writer Manager interface
export interface WriterManager extends User {
  role: "writer_manager"
  writersManaged: number
  walletBalance: number
}

// Order interface
export interface Order {
  id: string
  orderNumber: string
  customerId: string
  writerId?: string
  editorId?: string
  salesAgentId?: string
  writerManagerId?: string

  // Order details
  title: string
  topic: string
  description: string
  type: string
  educationLevel: string
  subject: string

  // Specifications
  pagesOrSlides: number
  words: number
  sourcesRequired: number
  citationStyle: string
  language: string
  spacing: string
  deliveryTimeHours?: number

  // Pricing
  totalAmount: number
  amountPaid: number
  currency: string

  // Status
  status: OrderStatus

  // Deadlines
  deadline?: Date | null
  startedAt?: Date | null
  submittedAt?: Date | null
  completedAt?: Date | null

  // Flags
  isRevision: boolean
  isOverdue: boolean
  customerIsReturning: boolean

  // Files associated with this order
  files?: OrderFile[]

  createdAt: string | null
  updatedAt: string | null
}

// Order Addon
export interface OrderAddon {
  id: string
  orderId: string
  addonType: string
  description: string
  price: number
  status: "pending" | "to_do" | "in_progress" | "completed"
}

// Order File
export interface OrderFile {
  id: string
  orderId: string
  uploadedBy: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  fileCategory: "instruction" | "attachment" | "draft" | "final" | "revision" | "additional"
  isSeen: boolean
  seenAt?: string
  uploadedAt: string
}

// Message
export interface Message {
  id: string
  orderId: string
  senderId: string
  receiverId?: string
  messageText: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// Transaction
export interface Transaction {
  id: string
  orderId?: string
  userId: string
  transactionType:
    | "order_payment"
    | "writer_earning"
    | "editor_earning"
    | "manager_earning"
    | "sales_commission"
    | "withdrawal"
    | "refund"
    | "bonus"
    | "penalty"
  amount: number
  currency: string
  description: string
  status: "pending" | "completed" | "failed" | "reversed"
  createdAt: string
}

// Revenue Distribution
export interface RevenueDistribution {
  id: string
  orderId: string
  totalAmount: number
  writerPercentage: number
  writerAmount: number
  salesAgentPercentage: number
  salesAgentAmount: number
  editorPercentage: number
  editorAmount: number
  managerPercentage: number
  managerAmount: number
  profitPercentage: number
  profitAmount: number
  isReturningCustomer: boolean
  isDistributed: boolean
  distributedAt?: string
}

// Dashboard Stats
export interface DashboardStats {
  available: number
  inProgress: number
  inReview: number
  revision: number
  disputed: number
  completedPaid: number
  completedUnpaid: number
  totalEarnings?: number
}

// Bid interface for writer bidding system
export interface Bid {
  id: string
  orderId: string
  writerId: string
  writerName: string
  writerRating: number
  writerCompletedOrders: number
  bidAmount: number
  currency: string
  deliveryHours: number
  coverLetter: string
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  submittedAt: string
  createdAt: string
}

// Sales Agent Customer interface for sales agent dashboard
export interface SalesAgentCustomer {
  id: string
  name: string
  email: string
  referralCode: string
  status: "new" | "returning"
  totalOrders: number
  totalSpent: number
  commissionEarned: number
  joinedDate: string
  lastOrderDate: string
}
