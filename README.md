# OnePc - Premium E-Commerce Platform for PC Hardware

OnePc is a high-performance, modern e-commerce platform built with Next.js 16 and Firebase. It features a sophisticated PC Builder, real-time inventory management, and a cinematic UI design tailored for hardware enthusiasts.

## 🚀 Key Features

- **Cinematic Hardware Showcase**: Dynamic video backgrounds and premium gallery effects.
- **Advanced PC Builder**: Interactive component configurator with compatibility checks.
- **Multi-Role System**: Dedicated interfaces for Admins, Delivery Personnel, and Customers.
- **High-Performance Caching**: ISR (Incremental Static Regeneration) for lightning-fast catalog browsing.
- **Dual Theme Support**: Seamless transition between high-contrast Light and Dark modes.
- **Global Search**: Real-time suggestions and optimized product discovery.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Database**: MongoDB (for Partner Brands)
- **State Management**: Zustand
- **Deployment**: Vercel (Edge Network & CDN)

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/onepc.git
cd onepc
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your credentials based on `.env.example`.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

Refer to `structure.md` for a detailed breakdown of the project's architecture and file hierarchy.

## 🔒 Security

This project uses Firebase Security Rules to protect sensitive data. Admin-only operations are restricted at the database level.

## 📄 License

This project is licensed under the MIT License.
