# 🎨 Color Accessibility Analyzer (AI)

An AI-powered web tool that analyzes images and color combinations for color accessibility issues. It simulates how images look to people with color vision deficiencies, checks WCAG compliance, offers a live contrast checker, generates PDF reports, and includes voice feedback, language translation, and a dark mode.



---

## 📸 Demo
Frontend View
![image](https://github.com/user-attachments/assets/2feeaadb-c936-4f67-b6ab-eb07009b5e1e)

Live contrast checker
![image](https://github.com/user-attachments/assets/20ea9891-50c0-4bd4-867e-a5b2e7fe05b7)

Analyzing the image uploaded and preparing a Report with the suitable results
![image](https://github.com/user-attachments/assets/e3d9c981-b4b4-427d-9a20-034f13fc15ef)

![image](https://github.com/user-attachments/assets/edab4906-1981-457a-80b3-f49513705ac7)

Multiple Vision Type Options
![image](https://github.com/user-attachments/assets/65837951-7a10-432f-b374-bff966d0f1c6)

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
