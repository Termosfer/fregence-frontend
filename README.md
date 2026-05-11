# 💎 Fregence - Premium Perfume E-Commerce Frontend

Fregence Frontend is a modern, high-performance, and fully responsive web application tailored for luxury fragrance boutiques. This project is built with a focus on seamless user experience (UX) and robust frontend architecture.

## 🚀 Tech Stack
- **Framework:** React 18 (Vite), TypeScript
- **Styling:** Tailwind CSS - *Fast and minimalist utility-first design*
- **Animations:** Framer Motion - *Luxury transition effects and 3D interactions*
- **Data Management:** TanStack Query (React Query) - *Smart caching and server-state sync*
- **State Management:** Zustand / React Context
- **HTTP Client:** Axios - *Secure requests handled via global interceptors*
- **Payment:** Stripe API (Test Mode) - *Real-time secure payment simulation*

## ✨ Key Features
- 🎨 **Premium UI:** Elegant and minimalist interface designed to reflect luxury brand values.
- 🔍 **Smart Search:** High-performance search system powered by Debounce technology.
- 🛒 **Dynamic Cart:** Real-time cart management using "Optimistic Updates" for instant feedback.
- 🚚 **Order Tracking:** Live order status updates (Pending → Shipped → Delivered) via Smart Polling.
- 📊 **Admin Dashboard:** Visualized real-time analytics including Revenue, Growth, and AOV.
- 📱 **Fully Responsive:** 100% compatibility across mobile, tablet, and desktop devices.

## ⚙️ Local Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Termosfer/fregence-frontend.git
2. Install the required dependencies:
   ```bash
   npm install
3. Create a .env file in the root directory and set the environment variables:
-   VITE_API_URL = (Your Backend API URL)
-   VITE_STRIPE_PUBLIC_KEY = (Your Stripe Test Key)
-   VITE_API_BASE_URL = (Your Backend Base URL for WebSockets)
4. Launch the development server:
   ```bash
   npm run dev
---
   Developed by Toghrul
