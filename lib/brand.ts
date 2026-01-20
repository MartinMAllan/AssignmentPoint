/**
 * Assignment Point Brand Configuration
 * Core branding colors and constants
 */

export const BRAND = {
  name: "Assignment Point",
  logo: "/assignment-point-logo.jpg",
  favicon: "/assignment-point-favicon.jpg",
  
  // Brand Colors
  colors: {
    primary: "#0066cc", // Professional blue
    secondary: "#00a8e8", // Teal accent
    accent: "#00d4ff", // Bright cyan
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    error: "#ef4444", // Red
    dark: "#1a1a1a", // Dark background
    light: "#f8fafc", // Light background
  },

  // Gradient combinations
  gradients: {
    primary: "from-blue-600 to-teal-500",
    accent: "from-cyan-500 to-blue-600",
    success: "from-green-500 to-emerald-600",
  },

  // Social Links
  social: {
    twitter: "#1DA1F2",
    facebook: "#1877F2",
    linkedin: "#0A66C2",
  },

  // Typography
  fonts: {
    primary: "Geist",
    mono: "Geist Mono",
  },

  // URLs
  urls: {
    home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
  },
}

export const BRAND_TEXT = {
  tagline: "Connect with Skilled Writers. Manage Your Assignments. Succeed.",
  mission: "Empowering students and professionals with quality academic writing solutions",
  description:
    "Assignment Point is your complete platform for academic writing services. Post assignments, connect with experienced writers, manage bids, and handle payments—all in one place.",
}
