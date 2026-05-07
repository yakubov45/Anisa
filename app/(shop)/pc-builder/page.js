"use client"

import { useState } from "react"
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
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-20 md:pt-8 px-4 sm:px-0">
            {/* Featured Section */}
            <ReadyBuilds />

            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('pc_builder_title')}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">PC BUILDER PRO</h1>
                <p className="text-foreground/60 font-medium max-w-2xl text-sm leading-relaxed">
                    {t('pc_builder_subtitle')}
                </p>
            </div>

            {/* Auto Builder Section */}
            <AutoBuilder />

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
