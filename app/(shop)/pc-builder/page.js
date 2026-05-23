"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslation } from "@/lib/LanguageContext"
import useBuildStore from "@/store/useBuildStore"
import ComponentSlot from "@/features/builder/ComponentSlot"
import ComponentPickerModal from "@/features/builder/ComponentPickerModal"
import BuildSummary from "@/features/builder/BuildSummary"
import ReadyBuilds from "@/features/builder/ReadyBuilds"
import BuilderGuide from "@/features/builder/BuilderGuide"
import AutoBuilder from "@/features/builder/AutoBuilder"

const COMPONENT_STRUCTURE = [
    // Core Components
    { id: 'cpu', title: 'Central Processing Unit', category: 'Processors', section: 'Core' },
    { id: 'motherboard', title: 'Motherboard', category: 'Motherboards', section: 'Core' },
    { id: 'ram', title: 'Memory (RAM)', category: 'Memory', section: 'Core' },
    { id: 'gpu', title: 'Graphics Card', category: 'Graphics', section: 'Core' },
    { id: 'storage', title: 'Storage (SSD/HDD)', category: 'Storage', section: 'Core' },
    { id: 'psu', title: 'Power Supply', category: 'PSUs', section: 'Core' },
    { id: 'case', title: 'Chassis (Case)', category: 'Cases', section: 'Core' },
    { id: 'cooling', title: 'Thermal Solution', category: 'Cooling', section: 'Core' },
    // Peripherals & Furniture
    { id: 'monitor', title: 'Monitor / Screen', category: 'Monitors', section: 'Setup' },
    { id: 'keyboard', title: 'Mechanical Keyboard', category: 'Klaviaturalar', section: 'Setup' },
    { id: 'mouse', title: 'Gaming Mouse', category: 'Sichqonchalar', section: 'Setup' },
    { id: 'headphones', title: 'Audio / Headset', category: 'Quloqchinlar', section: 'Setup' },
    { id: 'chair', title: 'Gaming Chair', category: 'Chairs', section: 'Setup' },
    { id: 'desk', title: 'Pro Gaming Desk', category: 'Desks', section: 'Setup' },
]

export default function PCBuilderPage() {
    const { t } = useTranslation()
    const { selectedParts, setPart, removePart } = useBuildStore()
    const [pickerState, setPickerState] = useState({ isOpen: false, category: '', id: '' })
    
    // Static video paths — admindan olib tashlandi, kod orqali o'zgartiriladi
    const VIDEO1 = "/videos/0508.mp4";
    const VIDEO2 = "/videos/0508%20(2).mp4";

    // Video Slider & Intersection State
    const [activeVideo, setActiveVideo] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const videoRef0 = useRef(null)
    const videoRef1 = useRef(null)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) {
            // Pause both if scrolled out of view
            videoRef0.current?.pause()
            videoRef1.current?.pause()
            return
        }

        if (activeVideo === 0) {
            videoRef0.current?.play().catch(e => console.log(e));
            videoRef1.current?.pause();
        } else {
            videoRef1.current?.play().catch(e => console.log(e));
            videoRef0.current?.pause();
        }
    }, [activeVideo, isVisible]);

    const handleVideoEnd = () => {
        setActiveVideo(prev => (prev === 0 ? 1 : 0));
    };

    const COMPONENT_STRUCTURE = [
        // Core Components
        { id: 'cpu', title: t('comp_cpu'), category: 'Processors', section: 'Core' },
        { id: 'motherboard', title: t('comp_mob'), category: 'Motherboards', section: 'Core' },
        { id: 'ram', title: t('comp_ram'), category: 'Memory', section: 'Core' },
        { id: 'gpu', title: t('comp_gpu'), category: 'Graphics', section: 'Core' },
        { id: 'storage', title: t('comp_sto'), category: 'Storage', section: 'Core' },
        { id: 'psu', title: t('comp_psu'), category: 'PSUs', section: 'Core' },
        { id: 'case', title: t('comp_cas'), category: 'Cases', section: 'Core' },
        { id: 'cooling', title: t('comp_coo'), category: 'Cooling', section: 'Core' },
        // Peripherals & Furniture
        { id: 'monitor', title: t('nav_products'), category: 'Monitors', section: 'Setup' },
        { id: 'keyboard', title: 'Mechanical Keyboard', category: 'Klaviaturalar', section: 'Setup' },
        { id: 'mouse', title: 'Gaming Mouse', category: 'Sichqonchalar', section: 'Setup' },
        { id: 'headphones', title: 'Audio / Headset', category: 'Quloqchinlar', section: 'Setup' },
        { id: 'chair', title: 'Gaming Chair', category: 'Chairs', section: 'Setup' },
        { id: 'desk', title: 'Pro Gaming Desk', category: 'Desks', section: 'Setup' },
    ]

    const openPicker = (id, category) => {
        setPickerState({ isOpen: true, category, id })
    }

    const handleSelectPart = (part) => {
        setPart(pickerState.id, part)
        setPickerState({ ...pickerState, isOpen: false })
    }

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-20 px-4 sm:px-0">
            {/* Split Hero Section with 3D Phone Mockup */}
            <section ref={sectionRef} className="relative flex flex-col-reverse lg:flex-row gap-16 lg:gap-8 items-center justify-between p-8 md:p-16 bg-[#050A15] rounded-3xl md:rounded-[3rem] border border-white/5 shadow-premium overflow-hidden mt-4 md:mt-0">
                
                {/* Background Decor (Optimized for performance) */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.3)_0%,transparent_70%)] rounded-full transform-gpu" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)] rounded-full transform-gpu" />
                </div>

                {/* Left: Enhanced Text Content */}
                <div className="flex-1 space-y-8 z-10 w-full relative">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t('pc_builder_title')}</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
                            {t('pc_builder_hero_line1')} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t('pc_builder_hero_line2')}</span> <br/> {t('pc_builder_hero_line3')}
                        </h1>
                        <p className="text-white/60 font-medium text-sm md:text-base leading-relaxed max-w-xl">
                            {t('pc_builder_subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black shadow-lg shadow-primary/20">✓</div>
                            <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-tight whitespace-pre-line">{t('pc_builder_feat1')}</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">⚡</div>
                            <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-tight whitespace-pre-line">{t('pc_builder_feat2')}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            onClick={() => document.getElementById('auto-builder-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-primary text-white font-black text-xs px-10 py-5 rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95"
                        >
                            {t('pc_builder_start')}
                        </button>
                    </div>
                </div>

                {/* Right: Dual Phone Mockups (Interactive Sequence) */}
                <div className="w-full lg:w-[500px] h-[450px] sm:h-[550px] shrink-0 relative z-10 mt-10 lg:mt-0 transform-gpu">
                    
                    {/* Phone 1 (Back/Left) */}
                    <div 
                        onClick={() => setActiveVideo(0)}
                        className={`absolute top-0 left-0 md:left-4 w-[200px] sm:w-[240px] md:w-[260px] aspect-[9/16] rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 bg-zinc-900 border-2 md:border-4 border-zinc-800 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group will-change-transform ${
                            activeVideo === 0 
                            ? 'z-30 scale-105 -translate-y-4 shadow-[20px_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(34,197,94,0.3)] opacity-100' 
                            : 'z-10 scale-90 opacity-60 shadow-lg hover:opacity-80 hover:scale-95'
                        }`}
                    >
                        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 w-16 md:w-20 h-4 md:h-6 bg-black rounded-full z-20 flex items-center justify-end px-2 md:px-3">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/10" />
                        </div>
                        <div className="relative w-full h-full rounded-[2rem] md:rounded-[2.2rem] overflow-hidden bg-black transform-gpu">
                            <video ref={videoRef0} onEnded={handleVideoEnd} muted playsInline preload="metadata" disablePictureInPicture disableRemotePlayback className="absolute inset-0 object-cover w-full h-full scale-105">
                                <source src={VIDEO1} type="video/mp4" />
                            </video>
                            <div className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none ${activeVideo === 0 ? 'opacity-0' : 'opacity-60'}`} />
                        </div>
                    </div>

                    {/* Phone 2 (Front/Right) */}
                    <div 
                        onClick={() => setActiveVideo(1)}
                        className={`absolute bottom-0 right-0 md:right-4 w-[220px] sm:w-[260px] md:w-[280px] aspect-[9/16] rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 bg-zinc-900 border-2 md:border-4 border-zinc-800 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group will-change-transform ${
                            activeVideo === 1 
                            ? 'z-30 scale-105 -translate-y-4 shadow-[30px_30px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(59,130,246,0.3)] opacity-100' 
                            : 'z-10 scale-90 opacity-60 shadow-lg hover:opacity-80 hover:scale-95'
                        }`}
                    >
                        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 w-16 md:w-20 h-4 md:h-6 bg-black rounded-full z-20 flex items-center justify-end px-2 md:px-3">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/10" />
                        </div>
                        <div className="relative w-full h-full rounded-[2rem] md:rounded-[2.2rem] overflow-hidden bg-black transform-gpu">
                            <video ref={videoRef1} onEnded={handleVideoEnd} muted playsInline preload="metadata" disablePictureInPicture disableRemotePlayback className="absolute inset-0 object-cover w-full h-full scale-105">
                                <source src={VIDEO2} type="video/mp4" />
                            </video>
                            <div className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none ${activeVideo === 1 ? 'opacity-0' : 'opacity-60'}`} />
                        </div>
                    </div>

                </div>
            </section>

            {/* Featured Section */}
            <ReadyBuilds />

            {/* Auto Builder Section */}
            <div id="auto-builder-section" className="scroll-mt-24">
                <AutoBuilder />
            </div>

            {/* Main Builder Area */}
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 relative items-start">
                {/* Left: Components Selection */}
                <div className="flex-1 space-y-4 md:space-y-6 w-full">
                    <div className="flex items-center justify-between border-b border-border-alpha pb-4">
                        <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">{t('pc_builder_component_selection')}</h3>
                        <span className="text-[9px] font-mono text-surface-400">VERSION 1.0.4 STABLE</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {COMPONENT_STRUCTURE.map(slot => (
                            <ComponentSlot
                                key={slot.id}
                                category={slot.id}
                                title={slot.title}
                                selectedPart={selectedParts[slot.id]}
                                onSelect={() => openPicker(slot.id, slot.category)}
                                onRemove={() => removePart(slot.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Summary Panel */}
                <div className="w-full lg:w-[400px]">
                    <BuildSummary />
                </div>
            </div>

            {/* Knowledge / Guide Section */}
            <BuilderGuide />

            {/* Picker Modal */}
            <ComponentPickerModal
                isOpen={pickerState.isOpen}
                onClose={() => setPickerState({ ...pickerState, isOpen: false })}
                category={pickerState.category}
                onSelect={handleSelectPart}
            />
        </div>
    );
}
