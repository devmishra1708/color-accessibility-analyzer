import React, { useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function App() {
  const [image, setImage] = useState(null);
  const [visionType, setVisionType] = useState("protanopia");
  const [result, setResult] = useState(null);
  const [simulatedImage, setSimulatedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [analysisTime, setAnalysisTime] = useState(null);
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");

  const imageBase64Ref = useRef(null);

  const getContrastRatio = (fg, bg) => {
    const hexToRgb = hex =>
      hex
        .replace("#", "")
        .match(/.{2}/g)
        .map(x => parseInt(x, 16) / 255);

    const luminance = ([r, g, b]) => {
      const a = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    const lum1 = luminance(hexToRgb(fg));
    const lum2 = luminance(hexToRgb(bg));

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  };

  const ratio = getContrastRatio(foreground, background);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file?.name || "");
    setResult(null);
    setSimulatedImage(null);
    setAnalysisTime(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('vision_type', visionType);

    try {
      const start = performance.now();
      const response = await axios.post('https://color-accessibility-analyzer.onrender.com/analyze', formData);
      const end = performance.now();
      setAnalysisTime(((end - start) / 1000).toFixed(2));
      setResult(response.data);
      setSimulatedImage(`data:image/png;base64,${response.data.simulated_image}`);
      imageBase64Ref.current = response.data.simulated_image;
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Color Accessibility Analyzer Report", 20, 20);
    doc.setFontSize(12);

    doc.text(`Vision Type: ${visionType}`, 20, 35);
    doc.text(`Image Name: ${imageName}`, 20, 45);
    doc.text(`Analysis Time: ${analysisTime} seconds`, 20, 55);

    if (result?.contrast_result) {
      doc.text(`Pixel 1 RGB: ${JSON.stringify(result.contrast_result.pixel_1)}`, 20, 70);
      doc.text(`Pixel 2 RGB: ${JSON.stringify(result.contrast_result.pixel_2)}`, 20, 80);
      doc.text(`Contrast Ratio: ${result.contrast_result.contrast_ratio}`, 20, 90);
      doc.text(
        `WCAG Pass: ${result.contrast_result.passes_wcag === "True" ? "Yes" : "No"}`,
        20, 100
      );
    }

    let y = 120;
    if (result?.text_readability?.length > 0) {
      doc.text("Text Readability:", 20, y);
      y += 10;
      result.text_readability.forEach((item, idx) => {
        doc.text(`"${item.text}" - Contrast: ${item.contrast_ratio} (${item.passes_wcag ? "Pass" : "Fail"})`, 20, y);
        y += 8;
      });
    }

    // Add original and simulated images
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const originalBase64 = reader.result.split(',')[1];
        doc.addPage();
        doc.setFontSize(14);
        doc.text("Original Image", 20, 20);
        doc.addImage(originalBase64, 'JPEG', 20, 30, 160, 120);

        if (imageBase64Ref.current) {
          doc.addPage();
          doc.text("Simulated Image", 20, 20);
          doc.addImage(imageBase64Ref.current, 'PNG', 20, 30, 160, 120);
        }

        doc.save("accessibility_report.pdf");
      };
      reader.readAsDataURL(image);
    } else {
      doc.save("accessibility_report.pdf");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 py-10 px-4 sm:px-10 font-inter text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">🎨 Color Accessibility Analyzer (AI)</h1>

        <div className="mb-8">
          <label className="block mb-3 text-lg font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:border-none file:bg-purple-600 file:text-white file:font-medium file:px-4 file:py-2 file:rounded-md file:cursor-pointer bg-gray-100 text-sm rounded-md w-full"
          />
          {imageName && <p className="text-sm text-gray-500 mt-2">📁 Selected: {imageName}</p>}
        </div>

        <div className="mb-8">
          <label className="block mb-3 text-lg font-semibold">Select Vision Type</label>
          <select
            value={visionType}
            onChange={(e) => setVisionType(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="protanopia">Protanopia (Red-Blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
            <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
            <option value="achromatopsia">Achromatopsia (No Color)</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          🚀 Analyze Image
        </button>

        {analysisTime && (
          <p className="text-sm mt-4 text-center text-gray-500">⚙️ Processed in {analysisTime} seconds</p>
        )}

        {result && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">📊 Analysis Result</h2>
            <p className="mb-2"><strong>📝 Message:</strong> {result.message}</p>
            <p className="mb-4"><strong>👁️ Simulation Type:</strong> {result.simulation}</p>

            <div className="bg-purple-50 p-5 rounded-lg shadow-inner">
              <p className="font-semibold mb-3">🔍 WCAG Contrast Evaluation:</p>
              <ul className="list-disc ml-6 text-sm space-y-2">
                <li>🎨 Pixel 1 RGB: {JSON.stringify(result.contrast_result.pixel_1)}</li>
                <li>🎨 Pixel 2 RGB: {JSON.stringify(result.contrast_result.pixel_2)}</li>
                <li>📈 Contrast Ratio: {result.contrast_result.contrast_ratio}</li>
                <li>
                  🧪 WCAG Pass:
                  {result.contrast_result.passes_wcag === "True" ? (
                    <span className="text-green-600 font-bold ml-2">✅ Yes</span>
                  ) : (
                    <span className="text-red-600 font-bold ml-2">❌ No</span>
                  )}
                </li>
              </ul>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-xl text-md font-semibold shadow hover:bg-green-700 transition"
            >
              📄 Download PDF Report
            </button>
          </div>
        )}

        {simulatedImage && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">🖼️ Simulated View</h2>
            <img
              src={simulatedImage}
              alt="Simulated Vision"
              className="w-full border rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="mt-12 bg-indigo-50 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">🎯 Live Contrast Checker</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">🎨 Foreground Color</label>
              <input
                type="color"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="w-full h-12 p-1 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">🎨 Background Color</label>
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full h-12 p-1 rounded border border-gray-300"
              />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-white shadow-inner text-sm leading-relaxed">
            <p><strong>🧮 Contrast Ratio:</strong> {ratio.toFixed(2)} : 1</p>
            <p>
              <strong>WCAG AA:</strong>{" "}
              {ratio >= 4.5 ? (
                <span className="text-green-600 font-semibold">✅ Pass</span>
              ) : (
                <span className="text-red-600 font-semibold">❌ Fail</span>
              )}
            </p>
            <p>
              <strong>WCAG AAA:</strong>{" "}
              {ratio >= 7 ? (
                <span className="text-green-600 font-semibold">✅ Pass</span>
              ) : (
                <span className="text-red-600 font-semibold">❌ Fail</span>
              )}
            </p>
          </div>

          <div
            className="mt-6 p-6 rounded-xl text-center font-semibold"
            style={{ backgroundColor: background, color: foreground }}
          >
            Sample Text - Check Visibility
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
