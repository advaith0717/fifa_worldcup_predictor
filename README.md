# ⚽ Belo 2026: FIFA World Cup Match Simulator & Tournament Continuum

Belo is a highly interactive, full-stack tournament sandbox and match simulator designed for the **FIFA World Cup 2026**. Styled with a distinctive, asymmetric modern interface, Belo lets you take control of the entire tournament journey—from the initial group stage kickoffs to the final championship trophy lift.

---

## 🚀 Key Features

* **Dynamic Tournament Continuum:** Matches are not calculated in isolation. As matches conclude, team ratings adjust dynamically using continuous ELO shifts. Teams carrying momentum behave differently in subsequent rounds!
* **Official FIFA Annex C Logic:** Fully implements the official 12-group World Cup 2026 regulations. It includes:
  * Precise group stage tiebreakers (Goal Difference, Goals Scored, Head-to-Head records).
  * The complex **8 best 3rd-placed ranking matrix** to determine wild-card knockout entries.
  * Real-time routing for the Round of 32 and subsequent knockout phases.
* **Fully Automated Knockouts:** The knockout bracket is 100% reactive. As soon as group stage scores are finalized, the bracket is updated instantly.
* **Favorite Team Tracker:** Select your favorite team to run customized Monte Carlo simulations forecasting their championship probability based on real-time bracket paths.
* **No "AI Slop" Visual Design:** Pristine visual typography pairing *Space Grotesk* for display elements with *JetBrains Mono* for technical metrics, completely clean margins, and satisfying hover state transitions.

---

## ❓ FAQ: Will Knockout Matches Update Automatically?

**Yes! The entire tournament bracket is fully automated and dynamic.** 

The simulator maintains a real-time reactive engine:
1. As you enter or simulate scores for Group Stage matches, the group tables re-sort instantly.
2. Once all matches in all 12 groups are complete, Belo's engine extracts the **top 2 teams** from each group and evaluates the **8 best 3rd-placed teams** across the entire tournament using the strict FIFA Annex C ranking criteria.
3. The Round of 32 bracket matchups are automatically calculated and filled.
4. Completing knockout matches instantly advances the winners to the Round of 16, Quarterfinals, Semifinals, and the Final. If you simulate an upset, the entire bracket recalculates subsequent matchups in real time!

---

## 📦 How to Download & Export Your Files

To move this codebase to your local machine or GitHub account, use the built-in export features in **Google AI Studio Build**:

1. Locate the **Settings menu (Gear Icon ⚙️)** in the top-right toolbar of the AI Studio interface.
2. Select **Export to GitHub** to link your GitHub account and push this project directly to a new or existing repository, OR
3. Select **Download ZIP** to package the entire project into a compressed folder. Extract this ZIP on your local machine to begin editing or hosting.

---

## 💻 Local Development Guide

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### 1. Install Dependencies
Open your terminal in the extracted project directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to a new file named `.env` in the root directory:
```bash
cp .env.example .env
```
*(Note: If you have server-side integrations or secrets, specify them here. The client runs safely out-of-the-box.)*

### 3. Run the Development Server
Start the local server in development mode:
```bash
npm run dev
```
Your application will be hosted locally at **`http://localhost:3000`**. Open this address in your web browser to play with the simulator.

### 4. Build for Production
To bundle the frontend and compile the backend Node server:
```bash
npm run build
```

---

## 🌐 Deployment Guide (Sharing with Friends)

You can easily deploy Belo to share it with your friends. Here are the best free and low-cost options:

### Option A: Static Frontend Hosting (e.g., Vercel, Netlify)
Since the main interactive engine runs entirely in the client-side React code, you can build and host it as a fast, static Single Page Application (SPA).

#### Deploying on Vercel:
1. Create a free account at [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Vercel will automatically detect the Vite environment. Configure your project build settings as follows:
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build` (or `vite build` if deploying as a pure frontend SPA)
   * **Output Directory:** `dist`
4. Click **Deploy**. Vercel will give you a public URL (e.g., `belo-predictor.vercel.app`) to share with your friends instantly!

---

### Option B: Full-Stack Cloud Run or Render Hosting
If you want to keep the custom Express wrapper (`server.ts`) active for proxying backend APIs or assets:

#### Deploying on Render:
1. Create an account at [Render](https://render.com).
2. Create a new **Web Service** and link your GitHub repository.
3. Configure the following environment settings:
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
4. Click **Deploy**. Render will host the Express app on port `3000` automatically.

---

## 🛠️ Stack & Technologies

* **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
* **Server Wrapper:** Express, TypeScript (transpiled to CJS with `esbuild`)
* **Icons & Animation:** Lucide-React, Framer Motion (imported from `motion/react`)
* **Algorithm / Model:** Continuous ELO, FIFA Group Tiebreakers, Monte Carlo Bracket Solvers

Enjoy simulating the World Cup! Let us know if you uncover any legendary underdog runs! 🏆
