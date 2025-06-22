# 🎨 Color Accessibility Analyzer (AI)

An AI-powered web tool that analyzes images and color combinations for color accessibility issues. It simulates how images look to people with color vision deficiencies, checks WCAG compliance, offers a live contrast checker, generates PDF reports, and includes voice feedback, language translation, and a dark mode.

![Banner](assets/banner.png) <!-- Add a banner image if you want -->

---

## 📸 Demo

Live at: [color-accessibility-analyzer.vercel.app](https://color-accessibility-analyzer.vercel.app)

---

## 🧠 Features

- ✅ **Color blindness simulation** (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
- 📷 **Upload and analyze any image**
- 🧮 **Live contrast checker** with WCAG AA/AAA evaluation
- 📄 **PDF Report Generation** with contrast scores and simulated views
- 🌗 **Dark mode toggle**
- 🔉 **Voice accessibility** (Text-to-speech for feedback)
- 🌐 **Language support** (English and Hindi)
- 🕓 **Upload history tracking**
- 🚀 **Deployed frontend on Vercel**, backend on Render

---

## 🛠️ Tech Stack

**Frontend**:  
- React.js  
- Tailwind CSS  
- jsPDF (for report generation)  
- Web Speech API (Text-to-Speech)  

**Backend**:  
- Python (Flask)  
- OpenCV  
- Pillow  
- WCAG contrast checker  
- FFmpeg (optional for advanced features)

---

## 🚀 Deployment

### 🔹 Frontend - Vercel

```bash
npm install
vercel --prod
