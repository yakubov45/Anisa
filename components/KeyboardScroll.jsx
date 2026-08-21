"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";

const localTexts = {
  uz: {
    t1h: "Razer Mouse.",
    t1p: "Mukammal boshqaruv.",
    t2h: "Tezlik uchun yaratilgan.",
    t2p: "Har bir harakat aniq.",
    t3h: "Yengil va Qulay.",
    t3p: "Ergonomik dizayn.",
    t4h: "O'yishga Tayyor.",
    t4p: "Qayta ko'rish uchun yuqoriga qayting.",
    loading: "Kadrlar yuklanmoqda...",
    conn: "Ulanish",
    type: "Turi",
    wire: "Simsiz / Bluetooth",
  },
  ru: {
    t1h: "Razer Mouse.",
    t1p: "Идеальное управление.",
    t2h: "Создана для скорости.",
    t2p: "Каждое движение точно.",
    t3h: "Легкая и Удобная.",
    t3p: "Эргономичный дизайн.",
    t4h: "Готова к Игре.",
    t4p: "Прокрутите вверх для повтора.",
    loading: "Загрузка кадров...",
    conn: "Подключение",
    type: "Тип",
    wire: "Беспроводная / Bluetooth",
  },
  en: {
    t1h: "Razer Mouse.",
    t1p: "Perfect control.",
    t2h: "Built for speed.",
    t2p: "Every movement is precise.",
    t3h: "Light and Comfortable.",
    t3p: "Ergonomic design.",
    t4h: "Ready to Play.",
    t4p: "Scroll back to replay.",
    loading: "Loading sequence...",
    conn: "Connection",
    type: "Type",
    wire: "Wireless / Bluetooth",
  }
};

export default function KeyboardScroll() {
  const { lang } = useTranslation();
  const tl = localTexts[lang] || localTexts.uz;

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  const frameCount = 121;

  useEffect(() => {
    let isCancelled = false;
    setLoaded(false);
    currentFrameRef.current = 0;
    
    // Faqat sichqoncha ishlatiladi va .webp formati kutilyapti
    const folder = "sichqoncha video frame";
    const loadedImages = new Array(frameCount).fill(null);

    const loadFirstFrame = async () => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `/${folder}/frame_001.webp`;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
      });
    };

    const loadSequence = async () => {
      // 1. Birinchi kadrni darhol yuklash
      const firstImg = await loadFirstFrame();
      if (isCancelled) return;
      
      loadedImages[0] = firstImg;
      setImages([...loadedImages]);
      setLoaded(true);

      // 2. Qolgan kadrlarni orqa fonda yuklash
      const batchSize = 10;
      for (let i = 1; i < frameCount; i += batchSize) {
        if (isCancelled) return;
        const promises = [];
        for (let j = 0; j < batchSize && i + j < frameCount; j++) {
          const idx = i + j;
          promises.push(new Promise((resolve) => {
            const img = new Image();
            const num = String(idx + 1).padStart(3, "0");
            img.src = `/${folder}/frame_${num}.webp`;
            img.onload = () => {
              if (!isCancelled) loadedImages[idx] = img;
              resolve();
            };
            img.onerror = () => resolve();
          }));
        }
        await Promise.all(promises);
        if (!isCancelled) {
          setImages([...loadedImages]);
        }
      }
    };

    loadSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  const drawImage = (index) => {
    if (!canvasRef.current || !images) return;
    
    let imgToDraw = images[index];
    if (!imgToDraw) {
      for(let i = index; i >= 0; i--) {
        if (images[i]) {
          imgToDraw = images[i];
          break;
        }
      }
    }
    
    if (!imgToDraw) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const hRatio = rect.width / imgToDraw.width;
    const vRatio = rect.height / imgToDraw.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (rect.width - imgToDraw.width * ratio) / 2;
    const centerShift_y = (rect.height - imgToDraw.height * ratio) / 2;

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.drawImage(
      imgToDraw,
      0, 0, imgToDraw.width, imgToDraw.height,
      centerShift_x, centerShift_y, imgToDraw.width * ratio, imgToDraw.height * ratio
    );
  };

  useEffect(() => {
    if (loaded && images.length > 0) {
      drawImage(currentFrameRef.current);
    }

    const handleResize = () => {
      if (loaded) requestAnimationFrame(() => drawImage(currentFrameRef.current));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loaded, images]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!loaded) return;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.max(0, Math.floor(latest * frameCount))
    );

    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      requestAnimationFrame(() => drawImage(frameIndex));
    }
  });



  const mouseSpecs = [
    { label: "Sensor", value: "PAW3395" },
    { label: tl.conn, value: tl.wire },
    { label: "DPI", value: "26000" },
    { label: "Weight", value: "55g" },
    { label: "Battery", value: "300mAh" },
    { label: "Switches", value: "Huano Blue" },
    { label: "Polling Rate", value: "1000Hz" },
    { label: "Skates", value: "PTFE", border: true }
  ];

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
        
        <div className="relative w-full max-w-[1400px] h-full max-h-[85vh] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0A0A0B]">

        {!loaded && (
          <div className="absolute z-40 inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/80 rounded-full animate-spin"></div>
            <p className="text-white/60 font-medium tracking-tight text-sm">{tl.loading}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />



        {/* Specs Card */}
        <div className="hidden lg:block absolute bottom-0 right-0 pointer-events-none z-10 w-[280px] md:w-[320px]">
          <div className="bg-white/80 backdrop-blur-2xl border-t border-l border-white/60 p-5 rounded-tl-2xl shadow-[-8px_-8px_32px_rgba(0,0,0,0.1)] transition-colors duration-500">
            <h3 className="text-black/90 font-bold text-sm md:text-base mb-3 tracking-tight border-b border-black/10 pb-2 flex items-center justify-between">
              Razer Mouse <span className="text-black/50 font-medium text-[10px] md:text-xs">(Carbon Black)</span>
            </h3>
            
            <div className="flex flex-col gap-2 text-[11px] md:text-xs">
              {mouseSpecs.map((spec, idx) => (
                <div key={idx} className={`flex justify-between items-center ${spec.border ? "pt-2 mt-1 border-t border-black/5" : ""}`}>
                  <span className="text-black/50 font-medium uppercase tracking-wider">{spec.label}</span>
                  <span className="text-black/80 font-bold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        </div>

      </div>
    </div>
  );
}
