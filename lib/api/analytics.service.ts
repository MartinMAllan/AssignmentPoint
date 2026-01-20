import apiClient from "../api-client"

// analytics.service.ts

export interface AnalyticsMetrics {
  totalRevenue: number
  totalOrders: number
  activeUsers: number
  avgOrderValue: number
}

export interface RevenueChartData {
  month: string
  revenue: number
  orders: number
}

export interface OrderStatusData {
  name: string
  value: number
  color: string
}

export interface UserGrowthData {
  totalWriters: number
  totalCustomers: number
  salesAgents: number
}

export interface TopWriterData {
  name: string
  completed: number
}

export interface CustomerAcquisitionData {
  week: string
  new: number
  returning: number
}


export const analyticsService = {
  getAnalyticsMetrics: async (timeRange = "30days"): Promise<AnalyticsMetrics> => {
    try {
      const response = await apiClient.get("/analytics/metrics", {
        params: { timeRange },
      })
      return (
        response.data?.data || {
          totalRevenue: 0,
          totalOrders: 0,
          activeUsers: 0,
          avgOrderValue: 0,
        }
      )
    } catch (error) {
      console.log("[v0] Analytics metrics fetch failed, using defaults")
      return {
        totalRevenue: 0,
        totalOrders: 0,
        activeUsers: 0,
        avgOrderValue: 0,
      }
    }
  },

  getRevenueChart: async (timeRange = "30days"): Promise<RevenueChartData[]> => {
    try {
      const response = await apiClient.get("/analytics/revenue-chart", {
        params: { timeRange },
      })
      return response.data?.data || []
    } catch (error) {
      return []
    }
  },

  getOrderStatusDistribution: async (): Promise<OrderStatusData[]> => {
    try {
      const response = await apiClient.get("/analytics/order-distribution")
      return response.data?.data || []
    } catch (error) {
      return []
    }
  },

  getUserGrowth: async (timeRange = "30days"): Promise<UserGrowthData> => {
    try {
      const response = await apiClient.get("/analytics/user-growth", {
        params: { timeRange },
      })
      return (
        response.data?.data || {
          totalWriters: 0,
          totalCustomers: 0,
          salesAgents: 0,
        }
      )
    } catch (error) {
      return {
        totalWriters: 0,
        totalCustomers: 0,
        salesAgents: 0,
      }
    }
  },

  getTopWriters: async (): Promise<TopWriterData[]> => {
    try {
      const response = await apiClient.get("/analytics/top-writers")
      return response.data?.data || []
    } catch (error) {
      return []
    }
  },

  getCustomerAcquisition: async (timeRange = "30days"): Promise<CustomerAcquisitionData[]> => {
    try {
      const response = await apiClient.get("/analytics/customer-acquisition", {
        params: { timeRange },
      })
      return response.data?.data || []
    } catch (error) {
      return []
    }
  },
}
