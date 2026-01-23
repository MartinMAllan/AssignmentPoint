import apiClient, { type ApiResponse, handleApiError } from "../api-client"
import type { Order } from "../types"

export interface CreateOrderRequest {
   title: string
  description: string
  type: string
  educationLevel: string
  subject: string
  pages?: number
  words?: number
  sourcesRequired?: number
  citationStyle?: string
  language?: string
  spacing?: string
  totalAmount: number
  deadline: string
  deliveryTime?: number
}

export interface UpdateOrderRequest {
  status?: string
  writerId?: number
  editorId?: number
}

export interface OrderFilters {
  status?: string
  customerId?: number
  writerId?: number
  subject?: string
  educationLevel?: string
  page?: number
  size?: number
}

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    deadline:
      typeof order.deadline === "string"
        ? new Date(order.deadline)
        : order.deadline ?? null,
  }
}

function normalizeDeadline(deadline: string | Date): string {
  if (deadline instanceof Date) {
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${deadline.getFullYear()}-${pad(deadline.getMonth() + 1)}-${pad(deadline.getDate())}` +
           `T${pad(deadline.getHours())}:${pad(deadline.getMinutes())}`
  }

  return deadline.slice(0, 16)
}

function cleanPayload<T extends Record<string, any>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== undefined && !(typeof value === "number" && isNaN(value))
    )
  ) as T
}

export const orderService = {
  
  async getAllOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>("/orders", {
        params: filters,
      })
      return response.data.data.map(normalizeOrder)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
  
  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`)
      return normalizeOrder(response.data.data)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      console.log("[OrderService] Creating order:", orderData)

      const payload = cleanPayload({
        ...orderData,
        deadline: normalizeDeadline(orderData.deadline),
      })

      const response = await apiClient.post<ApiResponse<Order>>("/orders", payload)
      return response.data.data
    } catch (error) {
      console.error("[OrderService] Create order failed:", error)
      throw new Error(handleApiError(error))
    }
  },

  async updateOrder(orderId: number, updates: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(
        `/orders/${orderId}`,
        updates
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async deleteOrder(orderId: number): Promise<void> {
    try {
      await apiClient.delete(`/orders/${orderId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(
        `/orders/customer/${customerId}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getOrdersByWriter(writerId: number): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(
        `/orders/writer/${writerId}`
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getAvailableOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(
        "/orders/available",
        { params: filters }
      )
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  /**
   * Creates order first, then uploads files (non-blocking)
   */
  async createOrderWithFiles(formData: FormData): Promise<Order> {
    try {
      console.log("[OrderService] Creating order with files")

      const payload = cleanPayload({
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        educationLevel: formData.get("educationLevel"),
        subject: formData.get("subject"),
        pages: Number(formData.get("pages")),
        words: Number(formData.get("words")),
        sourcesRequired: Number(formData.get("sourcesRequired")),
        citationStyle: formData.get("citationStyle"),
        language: formData.get("language"),
        spacing: formData.get("spacing"),
        totalAmount: Number(formData.get("totalAmount")),
        deadline: normalizeDeadline(String(formData.get("deadline"))),
        deliveryTime: Number(formData.get("deliveryTime")),
      })

      const response = await apiClient.post<ApiResponse<Order>>("/orders", payload)
      const order = response.data.data

      const files = formData.getAll("files") as File[]

      for (const file of files) {
        const fileForm = new FormData()
        fileForm.append("orderId", String(order.id))
        fileForm.append("file", file)
        fileForm.append("category", "reference_materials")

        try {
          await apiClient.post("/files/upload", fileForm, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          console.log("[OrderService] Uploaded:", file.name)
        } catch (err) {
          console.warn("[OrderService] File upload failed:", file.name, err)
        }
      }

      return order
    } catch (error) {
      console.error("[OrderService] Create order with files failed:", error)
      throw new Error(handleApiError(error))
    }
  },
}
