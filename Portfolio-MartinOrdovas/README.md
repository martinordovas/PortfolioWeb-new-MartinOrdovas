# Local Development & Deployment Guide

This guide explains how to set up, run, and build the **Portfolio Martin Ordovás** project locally on your machine.

---

## 📋 Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes bundled with Node.js)

Verify your installation by running:
```bash
node -v
npm -v
```

---

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/martinordovas/PortfolioWeb-new-MartinOrdovas.git
   cd PortfolioWeb-new-MartinOrdovas/Portfolio-MartinOrdovas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 🚀 Running the Local Development Server

To start the development server with live reload:

```bash
npm start
```
*(Alternatively, you can run `ng serve`)*

Once the server is running, open your web browser and navigate to:
```text
http://localhost:4200/
```

The application will automatically reload whenever you modify any of the source files in `src/`.

---

## 🏗️ Building for Production

To generate the optimized production build:

```bash
npm run build
```

This will compile the application and store the build artifacts in the `dist/` directory. The production build includes performance optimizations, minification, and Ahead-of-Time (AOT) compilation.

---

## 🧪 Running Tests

To execute unit tests using the Vitest test runner:

```bash
npm test
```
