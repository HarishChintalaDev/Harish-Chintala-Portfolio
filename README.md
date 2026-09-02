# Harish Chintala - Executive Portfolio Website

A PRODUCTION-READY, CEO-level executive portfolio website built for **Harish Chintala** (Senior SDET / Automation Architect / AI Automation Engineer) using Next.js 15 (App Router), React 19, TypeScript, TailwindCSS v4, Framer Motion, HTML5 Canvas, and custom Glassmorphism UI components.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **UI Core**: React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Custom Glassmorphism, Aurora Gradients
- **Animations**: Framer Motion, HTML5 Particle Canvas, Canvas Confetti
- **Icons**: Lucide React Icons
- **Deployment**: Edge Optimized for Vercel / Netlify

---

## 🛠 Local Development Instructions

### 1. Prerequisites
Ensure Node.js 18+ and npm are installed.

```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Quality Checks

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm audit --audit-level=low
```

The Playwright suite covers Chromium, Microsoft Edge, Firefox, and WebKit at desktop, laptop, phone, tablet, 320px-wide, and short-landscape viewports. Install its browser binaries once with `npx playwright install` if they are not already present.

### 6. Contact Delivery

The contact form is pre-configured to securely deliver submissions directly to your email via FormSubmit AJAX endpoint (`harishchintaladev@gmail.com`). No local environment setup is required.

Portfolio copy and structured content are organized into clean modular JSON files inside `content/` (`personal.json`, `experiences.json`, `projects.json`, etc.).

---

## ⚡ Deployment Guide (Vercel)

1. Push code to your GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository `harish-chintala-portfolio`.
4. Framework Preset: **Next.js**.
5. Click **Deploy**. Vercel will automatically run `npm run build` and output the production edge-cached portfolio.

---

## ✨ Features Included

- **Massive Hero Section**: Animated typewriter titles, glowing code snippet runner, impact statistics, quick CTAs.
- **Interactive Experience Timeline**: Detailed career highlights for Delta Air Lines, INTO Global, Amazon, and APSRTC.
- **Enterprise Case Studies**: Filterable project architecture cards detailing problem, solution, metrics, and tech stack.
- **Interactive Command Palette**: Press `Cmd + K` or `Ctrl + K` anywhere to open instant keyboard search and navigation.
- **Resume Access**: Direct, accessible PDF download from the hero and command palette.
- **Visual Canvas Backgrounds**: Fluid particles connected to cursor movement and glowing ambient aura mesh.
- **Contact System**: Validated server-side delivery, honest error handling, retained form data, and copy-email support.
