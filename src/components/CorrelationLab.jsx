"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, Network, RotateCcw, Search, Upload } from "lucide-react";

const samples = [
  "Hai Nama saya adalah Nicholas Ivan, saya adalah seorang mahasiswa di universitas Atma Jaya Yogyakarta jurusan Informatika. Saya memiliki ketertarikan yang besar dalam bidang Web Development dan Data Science, dengan fokus pada penerapan prinsip UI/UX modern untuk menciptakan pengalaman pengguna yang menarik dan intuitif. Saya juga memiliki minat yang mendalam dalam pengembangan model deteksi informasi berbasis AI, yang memungkinkan saya untuk mengeksplorasi potensi kecerdasan buatan dalam mengolah dan menganalisis data secara efektif.",
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "atau",
  "agar",
  "are",
  "as",
  "at",
  "be",
  "build",
  "bisa",
  "by",
  "dalam",
  "dan",
  "dari",
  "di",
  "for",
  "from",
  "ini",
  "i",
  "in",
  "into",
  "is",
  "itu",
  "it",
  "juga",
  "karena",
  "ke",
  "kurang",
  "lebih",
  "mereka",
  "my",
  "of",
  "on",
  "or",
  "pada",
  "portfolio",
  "saat",
  "saja",
  "sangat",
  "show",
  "saya",
  "sebagai",
  "supaya",
  "that",
  "the",
  "this",
  "tidak",
  "untuk",
  "yang",
  "through",
  "to",
  "using",
  "with",
  "without",
  "want",
]);

const edgeAlgorithms = [
  { id: "canny", label: "Canny", short: "Multi-step detector for clean, crisp edges." },
  { id: "sobel", label: "Sobel", short: "Gradient-based detector with strong directionality." },
  { id: "laplacian", label: "Laplacian", short: "Second-derivative response for sharp intensity changes." },
  { id: "prewitt", label: "Prewitt", short: "Simple directional gradient detector." },
];

function tokenize(text) {
  return text
    .toLowerCase()
    .match(/[a-z0-9']+/g)
    ?.map((word) => word.replace(/^'+|'+$/g, ""))
    .filter(Boolean) ?? [];
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function analyzeText(text) {
  const sentences = splitSentences(text);
  const documents = sentences.length ? sentences : text.trim() ? [text.trim()] : [];
  const documentTokens = documents.map((document) => tokenize(document).filter((word) => !stopWords.has(word)));
  const documentCount = documentTokens.length;
  const documentFrequencies = new Map();
  const sentenceMap = new Map();
  const termVectors = new Map();
  const tfIdfTotals = new Map();
  const tokens = documentTokens.flat();

  documentTokens.forEach((terms, documentIndex) => {
    const termCounts = new Map();
    terms.forEach((term) => {
      termCounts.set(term, (termCounts.get(term) ?? 0) + 1);
    });

    [...new Set(terms)].forEach((term) => {
      documentFrequencies.set(term, (documentFrequencies.get(term) ?? 0) + 1);
    });

    terms.forEach((term) => {
      const list = sentenceMap.get(term) ?? [];
      if (list.length < 3) {
        list.push(documents[documentIndex]);
        sentenceMap.set(term, list);
      }
    });

    const length = terms.length || 1;
    termCounts.forEach((count, term) => {
      const tf = count / length;
      const idf = Math.log((documentCount + 1) / ((documentFrequencies.get(term) ?? 0) + 1)) + 1;
      const weight = tf * idf;
      const vector = termVectors.get(term) ?? Array(documentCount).fill(0);
      vector[documentIndex] = weight;
      termVectors.set(term, vector);
      tfIdfTotals.set(term, (tfIdfTotals.get(term) ?? 0) + weight);
    });
  });

  const uniqueTerms = [...new Set(tokens)];

  const topTerms = [...tfIdfTotals.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([term, score]) => ({ term, score, count: documentFrequencies.get(term) ?? 0 }))
    .slice(0, 12);

  return {
    tokens,
    uniqueTerms,
    topTerms,
    sentenceMap,
    termVectors,
    sentenceCount: sentences.length,
  };
}

function cosineSimilarity(leftVector, rightVector) {
  if (!leftVector || !rightVector || leftVector.length !== rightVector.length) {
    return 0;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < leftVector.length; index += 1) {
    const leftValue = leftVector[index] ?? 0;
    const rightValue = rightVector[index] ?? 0;
    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (!dot || !leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
}

function highlightTerm(text, term) {
  if (!term) {
    return text;
  }

  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));

  return parts.map((part, index) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <mark key={`${term}-${index}`} className="bg-yellow-200 px-1 font-semibold text-gray-900">
        {part}
      </mark>
    ) : (
      <span key={`${term}-${index}`}>{part}</span>
    )
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function grayscaleFromImageData(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);

  for (let index = 0, pixel = 0; index < gray.length; index += 1, pixel += 4) {
    gray[index] = data[pixel] * 0.299 + data[pixel + 1] * 0.587 + data[pixel + 2] * 0.114;
  }

  return gray;
}

function convolveGray(gray, width, height, kernel, divisor = 1) {
  const output = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let sum = 0;

      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const sourceIndex = (y + ky) * width + (x + kx);
          const kernelIndex = (ky + 1) * 3 + (kx + 1);
          sum += gray[sourceIndex] * kernel[kernelIndex];
        }
      }

      output[y * width + x] = sum / divisor;
    }
  }

  return output;
}

function blurGray(gray, width, height) {
  return convolveGray(gray, width, height, [1, 2, 1, 2, 4, 2, 1, 2, 1], 16);
}

function gradientFromGray(gray, width, height, kernelX, kernelY) {
  const magnitude = new Float32Array(width * height);
  const angle = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let gx = 0;
      let gy = 0;

      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const sourceIndex = (y + ky) * width + (x + kx);
          const kernelIndex = (ky + 1) * 3 + (kx + 1);
          gx += gray[sourceIndex] * kernelX[kernelIndex];
          gy += gray[sourceIndex] * kernelY[kernelIndex];
        }
      }

      const index = y * width + x;
      magnitude[index] = Math.sqrt(gx * gx + gy * gy);
      angle[index] = Math.atan2(gy, gx);
    }
  }

  return { magnitude, angle };
}

function normalizeFloatArray(values) {
  let maxValue = 0;

  for (let index = 0; index < values.length; index += 1) {
    if (values[index] > maxValue) {
      maxValue = values[index];
    }
  }

  const normalized = new Uint8ClampedArray(values.length);
  if (maxValue === 0) {
    return normalized;
  }

  for (let index = 0; index < values.length; index += 1) {
    normalized[index] = Math.round((values[index] / maxValue) * 255);
  }

  return normalized;
}

function nonMaximumSuppression(magnitude, angle, width, height) {
  const output = new Float32Array(width * height);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      let direction = (angle[index] * 180) / Math.PI;

      if (direction < 0) {
        direction += 180;
      }

      let neighborOne = 0;
      let neighborTwo = 0;

      if (direction < 22.5 || direction >= 157.5) {
        neighborOne = magnitude[index - 1];
        neighborTwo = magnitude[index + 1];
      } else if (direction < 67.5) {
        neighborOne = magnitude[index - width + 1];
        neighborTwo = magnitude[index + width - 1];
      } else if (direction < 112.5) {
        neighborOne = magnitude[index - width];
        neighborTwo = magnitude[index + width];
      } else {
        neighborOne = magnitude[index - width - 1];
        neighborTwo = magnitude[index + width + 1];
      }

      output[index] = magnitude[index] >= neighborOne && magnitude[index] >= neighborTwo ? magnitude[index] : 0;
    }
  }

  return output;
}

function buildColumnProfile(values, width, height) {
  const sampleCount = 64;
  const profile = new Array(sampleCount).fill(0);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const startX = Math.floor((sampleIndex / sampleCount) * width);
    const endX = Math.max(startX + 1, Math.floor(((sampleIndex + 1) / sampleCount) * width));
    let total = 0;
    let count = 0;

    for (let x = startX; x < endX && x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        total += values[y * width + x];
        count += 1;
      }
    }

    profile[sampleIndex] = count ? total / count : 0;
  }

  return profile;
}

function edgePixelsFromValues(values, width, height) {
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let index = 0, pixel = 0; index < values.length; index += 1, pixel += 4) {
    const shade = 255 - clamp(values[index], 0, 255);
    pixels[pixel] = shade;
    pixels[pixel + 1] = shade;
    pixels[pixel + 2] = shade;
    pixels[pixel + 3] = 255;
  }

  return pixels;
}

function detectEdges(imageData, algorithm) {
  const { width, height } = imageData;
  const gray = grayscaleFromImageData(imageData);
  const sobelKernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelKernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const prewittKernelX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
  const prewittKernelY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
  let edgeValues = new Uint8ClampedArray(width * height);
  let strongEdges = 0;

  if (algorithm === "laplacian") {
    const laplacian = convolveGray(gray, width, height, [0, 1, 0, 1, -4, 1, 0, 1, 0]);
    const absoluteValues = new Float32Array(laplacian.length);

    for (let index = 0; index < laplacian.length; index += 1) {
      absoluteValues[index] = Math.abs(laplacian[index]);
    }

    edgeValues = normalizeFloatArray(absoluteValues);
  } else {
    const gradientSource = algorithm === "canny" ? blurGray(gray, width, height) : gray;
    const kernels = algorithm === "prewitt"
      ? { x: prewittKernelX, y: prewittKernelY }
      : { x: sobelKernelX, y: sobelKernelY };
    const { magnitude, angle } = gradientFromGray(gradientSource, width, height, kernels.x, kernels.y);

    if (algorithm === "canny") {
      const suppressed = nonMaximumSuppression(magnitude, angle, width, height);
      let maxValue = 0;

      for (let index = 0; index < suppressed.length; index += 1) {
        if (suppressed[index] > maxValue) {
          maxValue = suppressed[index];
        }
      }

      const highThreshold = maxValue * 0.25;
      const lowThreshold = highThreshold * 0.45;
      const status = new Uint8Array(suppressed.length);
      const stack = [];

      for (let index = 0; index < suppressed.length; index += 1) {
        if (suppressed[index] >= highThreshold) {
          status[index] = 2;
          stack.push(index);
          strongEdges += 1;
        } else if (suppressed[index] >= lowThreshold) {
          status[index] = 1;
        }
      }

      while (stack.length) {
        const current = stack.pop();
        const currentX = current % width;
        const currentY = Math.floor(current / width);

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if (offsetX === 0 && offsetY === 0) {
              continue;
            }

            const neighborX = currentX + offsetX;
            const neighborY = currentY + offsetY;

            if (neighborX <= 0 || neighborX >= width - 1 || neighborY <= 0 || neighborY >= height - 1) {
              continue;
            }

            const neighborIndex = neighborY * width + neighborX;

            if (status[neighborIndex] === 1) {
              status[neighborIndex] = 2;
              stack.push(neighborIndex);
              strongEdges += 1;
            }
          }
        }
      }

      for (let index = 0; index < status.length; index += 1) {
        edgeValues[index] = status[index] === 2 ? 255 : 0;
      }
    } else {
      edgeValues = normalizeFloatArray(magnitude);
      for (let index = 0; index < edgeValues.length; index += 1) {
        if (edgeValues[index] > 128) {
          strongEdges += 1;
        }
      }
    }
  }

  let totalEdgeValue = 0;
  for (let index = 0; index < edgeValues.length; index += 1) {
    totalEdgeValue += edgeValues[index];
  }

  return {
    edgePixels: edgePixelsFromValues(edgeValues, width, height),
    profile: buildColumnProfile(edgeValues, width, height),
    strongEdges,
    edgeDensity: edgeValues.length ? totalEdgeValue / (edgeValues.length * 255) : 0,
  };
}

function ImageEdgePlayground() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("canny");
  const [imageSource, setImageSource] = useState("");
  const [processedSource, setProcessedSource] = useState("");
  const [graphProfile, setGraphProfile] = useState(() => new Array(64).fill(0));
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, edgeDensity: 0, strongEdges: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!imageSource) {
      return undefined;
    }

    let cancelled = false;
    const image = new window.Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }

      const maxDimension = 420;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const result = detectEdges(imageData, selectedAlgorithm);

      if (cancelled) {
        return;
      }

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outputContext = outputCanvas.getContext("2d");

      if (!outputContext) {
        return;
      }

      outputContext.putImageData(new ImageData(result.edgePixels, width, height), 0, 0);

      setProcessedSource(outputCanvas.toDataURL("image/png"));
      setGraphProfile(result.profile);
      setImageMeta({
        width,
        height,
        edgeDensity: result.edgeDensity,
        strongEdges: result.strongEdges,
      });
    };

    image.src = imageSource;

    return () => {
      cancelled = true;
    };
  }, [imageSource, selectedAlgorithm]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSource(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const displayMeta = imageSource ? imageMeta : { width: 0, height: 0, edgeDensity: 0, strongEdges: 0 };
  const displayProcessedSource = imageSource ? processedSource : "";
  const displayGraphProfile = imageSource ? graphProfile : new Array(64).fill(0);

  const profilePoints = useMemo(() => {
    const highest = Math.max(...displayGraphProfile, 1);

    return displayGraphProfile
      .map((value, index) => {
        const x = (index / Math.max(displayGraphProfile.length - 1, 1)) * 100;
        const y = 88 - (value / highest) * 72;
        return `${x},${y}`;
      })
      .join(" ");
  }, [displayGraphProfile]);

  const activeInfo = edgeAlgorithms.find((algorithm) => algorithm.id === selectedAlgorithm) ?? edgeAlgorithms[0];

  return (
    <section id="image-lab" className="mt-24 pb-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mt-3 flex items-center gap-3">
            <Network className="h-8 w-8 text-gray-700" />
            <h2 className="text-5xl font-black underline decoration-wavy decoration-2">
              Edge Detection Lab
            </h2>
          </div>
          <div className="mt-4 max-w-3xl rounded-3xl border-2 border-gray-900 bg-white/70 p-4 md:p-5 shadow-[6px_8px_0_0_rgba(0,0,0,0.14)]">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-2">
              Apa yang anda lihat disini?
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-700">
              Upload gambar, lalu bandingkan hasil edge detection dengan Canny,
              Sobel, Laplacian, dan Prewitt. Graf di sebelah kiri menampilkan edge
              profile image.
            </p>
          </div>
        </div>
        <div className="pencil-sketch bg-white/70 p-4 md:max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">Legend</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><span className="font-black text-gray-900">Canny</span>: tepi paling bersih dan tajam.</li>
            <li><span className="font-black text-gray-900">Sobel / Prewitt</span>: gradient detector sederhana.</li>
            <li><span className="font-black text-gray-900">Laplacian</span>: lebih sensitif ke perubahan intensitas.</li>
          </ul>
        </div>
      </div>

      <motion.div
        className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start"
        style={{ perspective: 1400, transformStyle: "preserve-3d", rotateX: "-3deg", rotateY: "2deg" }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
      >
        <motion.div
          className="pencil-sketch bg-[#fffdf9] p-5 md:p-6"
          style={{ transform: "translateZ(32px)" }}
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-4 flex items-center gap-3 text-gray-500">
            <Search className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">Edge graph</span>
          </div>
          <div className="relative overflow-hidden rounded-3xl border-2 border-gray-900 bg-linear-to-b from-white/90 to-amber-50/70 p-4 shadow-[8px_10px_0_0_rgba(0,0,0,0.12)]">
            <svg viewBox="0 0 100 100" className="h-64 w-full">
              <defs>
                <filter id="edge-graph-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.1" floodColor="#2563eb" floodOpacity="0.25" />
                </filter>
              </defs>

              {[20, 40, 60, 80].map((line) => (
                <line key={line} x1="8" y1={line} x2="96" y2={line} stroke="#cbd5e1" strokeDasharray="1.5 2.5" opacity="0.5" />
              ))}

              <line x1="8" y1="88" x2="96" y2="88" stroke="#111827" strokeOpacity="0.25" />

              <polyline
                points={profilePoints || "0,88 100,88"}
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#edge-graph-glow)"
              />

              <path d={`M ${profilePoints || "0,88 100,88"} L 100,92 L 0,92 Z`} fill="rgba(37, 99, 235, 0.08)" />
            </svg>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-900 bg-white p-3 shadow-[3px_4px_0_0_rgba(0,0,0,0.12)]">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">Resolution</p>
                <p className="mt-1 text-lg font-black text-gray-900">{displayMeta.width && displayMeta.height ? `${displayMeta.width} x ${displayMeta.height}` : "-"}</p>
              </div>
              <div className="rounded-2xl border border-gray-900 bg-white p-3 shadow-[3px_4px_0_0_rgba(0,0,0,0.12)]">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">Edge density</p>
                <p className="mt-1 text-lg font-black text-gray-900">{(displayMeta.edgeDensity * 100).toFixed(1)}%</p>
              </div>
              <div className="rounded-2xl border border-gray-900 bg-white p-3 shadow-[3px_4px_0_0_rgba(0,0,0,0.12)]">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">Strong edges</p>
                <p className="mt-1 text-lg font-black text-gray-900">{displayMeta.strongEdges}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div className="pencil-sketch bg-[#fffdf9] p-5 md:p-6" style={{ transform: "translateZ(28px)" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Upload and play</p>
                <p className="mt-2 text-lg text-gray-700">Pilih gambar lalu bandingkan hasil edge detection secara live.</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border-2 border-gray-900 bg-amber-200 px-4 py-2 text-sm font-black shadow-[4px_5px_0_0_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5"
              >
                <Upload className="h-4 w-4" />
                Upload image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {edgeAlgorithms.map((algorithm) => {
                const isActive = selectedAlgorithm === algorithm.id;
                return (
                  <button
                    key={algorithm.id}
                    type="button"
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                    className={`rounded-full border-2 border-gray-900 px-4 py-2 text-left transition-transform hover:-translate-y-0.5 ${isActive ? "bg-amber-200 font-black" : "bg-white font-bold"}`}
                  >
                    {algorithm.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">{activeInfo.short}</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            <motion.div className="pencil-sketch bg-white/70 p-4 md:p-5" style={{ transform: "translateZ(30px)" }} whileHover={{ y: -4 }}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Original image</p>
              <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-400 bg-[#faf7f0]">
                {imageSource ? (
                  <div className="relative h-64 w-full">
                    <NextImage src={imageSource} alt="Uploaded preview" fill unoptimized className="object-contain" />
                  </div>
                ) : (
                  <p className="max-w-xs px-6 text-center text-sm leading-relaxed text-gray-500">
                    Upload gambar untuk mulai eksplorasi edge detection.
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div className="pencil-sketch bg-white/70 p-4 md:p-5" style={{ transform: "translateZ(30px)" }} whileHover={{ y: -4 }}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Edge output</p>
              <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-400 bg-[#faf7f0]">
                {displayProcessedSource ? (
                  <div className="relative h-64 w-full">
                    <NextImage src={displayProcessedSource} alt={`Edge result ${selectedAlgorithm}`} fill unoptimized className="object-contain" />
                  </div>
                ) : (
                  <p className="max-w-xs px-6 text-center text-sm leading-relaxed text-gray-500">
                    Hasil edge detection akan muncul di sini setelah gambar diupload.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function CorrelationLab() {
  const [text, setText] = useState(samples[0]);
  const [activeTerm, setActiveTerm] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stats = useMemo(() => analyzeText(text), [text]);

  const resolvedActiveTerm = activeTerm && stats.uniqueTerms.includes(activeTerm)
    ? activeTerm
    : stats.topTerms[0]?.term ?? "";

  const relatedTerms = useMemo(() => {
    return stats.topTerms
      .filter((item) => item.term !== resolvedActiveTerm)
      .map((item) => ({
        ...item,
        score: cosineSimilarity(stats.termVectors.get(resolvedActiveTerm), stats.termVectors.get(item.term)),
      }))
      .sort((left, right) => right.score - left.score || right.count - left.count)
      .slice(0, 6);
  }, [resolvedActiveTerm, stats]);

  const concordance = stats.sentenceMap.get(resolvedActiveTerm) ?? stats.topTerms.slice(0, 3).map((item) => item.term);

  const graphNodes = useMemo(() => {
    return relatedTerms.map((item, index) => {
      const angle = (-120 + index * 40) * (Math.PI / 180);
      return {
        ...item,
        x: 50 + Math.cos(angle) * 32,
        y: 50 + Math.sin(angle) * 32,
      };
    });
  }, [relatedTerms]);

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({ x: offsetX * 8, y: offsetY * 8 });
  };

  return (
    <>
      <section
        id="nlp-lab"
        className="h-full flex flex-col justify-center pt-28 pb-12 max-w-6xl mx-auto px-8 w-full"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.35em] text-gray-600">
              Little bit Show off will not hurt, right?
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Network className="h-8 w-8 text-gray-700" />
              <h2 className="text-5xl font-black underline decoration-wavy decoration-2">
                This is TF-IDF Playground
              </h2>
            </div>
            <div className="mt-4 max-w-3xl rounded-3xl border-2 border-gray-900 bg-white/70 p-4 md:p-5 shadow-[6px_8px_0_0_rgba(0,0,0,0.14)]">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-2">
                Apa itu TF-IDF?
              </p>
              <p className="text-base md:text-lg leading-relaxed text-gray-700">
                TF-IDF (Term Frequency - Inverse Document Frequency) adalah cara
                memberi bobot pada kata yang penting di teks ini. Kata yang sering
                muncul di sini, tetapi jarang muncul di dokumen lain, akan punya
                skor lebih tinggi. Karena itu user bisa langsung melihat kata mana
                yang paling mewakili isi teks.
              </p>
            </div>
          </div>
          <div className="pencil-sketch bg-white/70 p-4 md:max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">Legend</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><span className="font-black text-gray-900">Active term</span>: kata yang sedang dipilih untuk dianalisis.</li>
              <li><span className="font-black text-gray-900">Top relation</span>: term paling dekat secara cosine similarity.</li>
              <li><span className="font-black text-gray-900">Concordance</span>: kalimat yang mengandung active term.</li>
            </ul>
          </div>
        </div>

        <motion.div
          className="grid gap-10 lg:grid-cols-[1fr_1.05fr] items-start"
          style={{ perspective: 1400, transformStyle: "preserve-3d", rotateX: `${tilt.y * -1}deg`, rotateY: `${tilt.x}deg` }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <div className="space-y-6">
            <motion.div className="pencil-sketch bg-[#fffdf9] p-5 md:p-6" style={{ transform: "translateZ(34px)" }} animate={{ y: [0, 6, 0] }} transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}>
              <div className="mb-4 flex items-center gap-3 text-gray-500">
                <Search className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.3em]">Relation graph</span>
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-linear-to-b from-white/90 to-amber-50/70">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                  <defs>
                    <filter id="graph-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  <motion.line x1="50" y1="50" x2="50" y2="50" stroke="#111827" strokeOpacity="0.25" strokeDasharray="2 2" />
                  {graphNodes.map((node) => (
                    <motion.line key={`graph-edge-${node.term}`} x1="50" y1="50" x2={node.x} y2={node.y} stroke="#2563eb" strokeWidth="1.4" strokeOpacity={Math.min(0.8, 0.25 + node.score)} />
                  ))}
                </svg>

                <motion.button
                  type="button"
                  onClick={() => setActiveTerm(resolvedActiveTerm)}
                  whileHover={{ scale: 1.06, rotateX: 8 }}
                  whileTap={{ scale: 0.98 }}
                  className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-gray-900 bg-amber-200 text-center text-sm font-black leading-tight shadow-[8px_10px_0_0_rgba(0,0,0,0.16)]"
                >
                  <span>{resolvedActiveTerm || "Active term"}</span>
                </motion.button>

                {graphNodes.map((node, index) => (
                  <motion.button
                    key={node.term}
                    type="button"
                    onClick={() => setActiveTerm(node.term)}
                    whileHover={{ scale: 1.08, rotateX: 6 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-900 bg-white px-3 py-2 text-xs font-black shadow-[4px_5px_0_0_rgba(0,0,0,0.14)]"
                  >
                    {node.term}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div className="pencil-sketch bg-[#fffdf9] p-6 md:p-8" style={{ transform: "translateZ(28px)" }}>
              <div className="mb-4 flex items-center gap-3 text-gray-500">
                <Keyboard className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.3em]">Write your text</span>
              </div>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="min-h-56 w-full rounded-2xl border-2 border-gray-900 bg-white/80 p-4 text-lg leading-relaxed outline-none transition-shadow focus:shadow-[6px_6px_0_0_rgba(0,0,0,0.18)]"
                placeholder="Paste a project description, research summary, or about-me paragraph here..."
              />
              <div className="mt-4 flex flex-wrap gap-3">
                {samples.map((sample, index) => (
                  <button key={sample} type="button" onClick={() => setText(sample)} className="rounded-full border border-gray-900 bg-yellow-100 px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5">
                    Contoh {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setActiveTerm("");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-900 bg-white px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Tokens", value: stats.tokens.length },
                { label: "Unique terms", value: stats.uniqueTerms.length },
                { label: "Sentences", value: stats.sentenceCount },
              ].map((item) => (
                <motion.div key={item.label} className="pencil-sketch bg-white/70 p-4" style={{ transform: "translateZ(18px)" }} whileHover={{ y: -3 }}>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-gray-900">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div className="pencil-sketch bg-[#fffdf9] p-4 md:p-6" style={{ transform: "translateZ(22px)" }}>
              <div className="flex flex-wrap gap-2">
                {stats.topTerms.length ? (
                  stats.topTerms.map((item) => {
                    const isActive = item.term === activeTerm;
                    return (
                      <motion.button
                        key={item.term}
                        type="button"
                        onClick={() => setActiveTerm(item.term)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className={`rounded-full border-2 border-gray-900 px-4 py-2 text-left font-black shadow-[3px_3px_0_0_rgba(0,0,0,0.14)] transition-all ${isActive ? "bg-amber-200" : "bg-white"}`}
                      >
                        <span className="mr-2 text-xs uppercase tracking-[0.25em] text-gray-500">{item.score.toFixed(2)}</span>
                        {item.term}
                      </motion.button>
                    );
                  })
                ) : (
                  <p className="text-lg text-gray-600">Start typing to generate terms.</p>
                )}
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              <motion.div key={activeTerm || "empty"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="pencil-sketch bg-white/70 p-5 md:p-6" style={{ transform: "translateZ(32px)" }}>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Active term</p>
                <h3 className="mt-2 text-3xl font-black text-gray-900">{activeTerm || "None"}</h3>
              </motion.div>

              <motion.div className="pencil-sketch bg-white/70 p-5 md:p-6" style={{ transform: "translateZ(32px)" }} whileHover={{ y: -4 }}>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Top relation</p>
                <h3 className="mt-2 text-3xl font-black text-gray-900">{relatedTerms[0]?.term ?? "N/A"}</h3>
              </motion.div>
            </div>

            <motion.div className="pencil-sketch bg-white/70 p-5 md:p-6" style={{ transform: "translateZ(22px)" }}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Concordance</p>
              <AnimatePresence mode="wait">
                <motion.div key={resolvedActiveTerm || "empty-concordance"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }} className="space-y-4">
                  {concordance.length ? (
                    concordance.map((sentence, index) => (
                      <p key={`${sentence}-${index}`} className="text-lg leading-relaxed text-gray-800">
                        {typeof sentence === "string" ? highlightTerm(sentence, resolvedActiveTerm) : sentence}
                      </p>
                    ))
                  ) : (
                    <p className="text-lg leading-relaxed text-gray-600">No text yet. Type a sentence to see context lines here.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div className="pencil-sketch bg-white/70 p-5 md:p-6" style={{ transform: "translateZ(22px)" }} whileHover={{ y: -4 }}>
              <div className="mb-4 flex items-center gap-3 text-gray-500">
                <Search className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.3em]">TF-IDF map</span>
              </div>
              <div className="space-y-3">
                {relatedTerms.length ? (
                  relatedTerms.map((item) => (
                    <button key={item.term} type="button" onClick={() => setActiveTerm(item.term)} className="w-full rounded-2xl border border-gray-900 bg-white px-4 py-3 text-left transition-transform hover:-translate-y-0.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-black text-gray-900">{item.term}</span>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{(item.score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-amber-300" style={{ width: `${Math.min(100, Math.max(10, item.score * 100))}%` }} />
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-600">No relation map yet. Add more text to see term connections.</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <ImageEdgePlayground />
    </>
  );
}