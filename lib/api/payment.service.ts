import apiClient, { ApiResponse, handleApiError } from '@/lib/api-client'

export const createStripeDeposit = async (amount: number, description?: string) => {
  try {
    console.log("[v0] Payment service: Creating Stripe deposit", { amount, description })
    const response = await apiClient.post<ApiResponse<any>>('/payments/deposit/stripe', {
      amount,
      description,
    })
    console.log("[v0] Payment service: Stripe deposit response", response.data)
    return response.data.data
  } catch (error) {
    console.error("[v0] Payment service: Stripe deposit error", error)
    throw new Error(handleApiError(error))
  }
}

export const createPayPalDeposit = async (amount: number, returnUrl: string, description?: string) => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/payments/deposit/paypal', {
      amount,
      returnUrl,
      description,
    })
    return response.data.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export const confirmStripePayment = async (paymentIntentId: string) => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/payments/stripe/confirm', {
      paymentIntentId,
    })
    return response.data.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export const confirmPayPalPayment = async (paypalOrderId: string) => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/payments/paypal/confirm', {
      paypalOrderId,
    })
    return response.data.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export const getWalletBalance = async () => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/payments/wallet/balance')
    return response.data.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export const getPaymentHistory = async () => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/payments/history')
    return response.data.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}
