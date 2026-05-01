"use client"

import { useState } from "react"
import useBuildStore from "@/store/useBuildStore"
import ComponentSlot from "@/features/builder/ComponentSlot"
import ComponentPickerModal from "@/features/builder/ComponentPickerModal"
import BuildSummary from "@/features/builder/BuildSummary"
import ReadyBuilds from "@/features/builder/ReadyBuilds"
import BuilderGuide from "@/features/builder/BuilderGuide"
import AutoBuilder from "@/features/builder/AutoBuilder"

const COMPONENT_STRUCTURE = [
    { id: 'cpu', title: 'Central Processing Unit', category: 'Processors' },
    { id: 'motherboard', title: 'Motherboard', category: 'Motherboards' },
    { id: 'ram', title: 'Memory (RAM)', category: 'Memory' },
    { id: 'gpu', title: 'Graphics Card', category: 'Graphics' },
    { id: 'storage', title: 'Storage (SSD/HDD)', category: 'Storage' },
    { id: 'psu', title: 'Power Supply', category: 'PSUs' },
    { id: 'case', title: 'Chassis (Case)', category: 'Cases' },
    { id: 'cooling', title: 'Thermal Solution', category: 'Cooling' },
]

export default function PCBuilderPage() {
    const { selectedParts, setPart, removePart } = useBuildStore()
    const [pickerState, setPickerState] = useState({ isOpen: false, category: '', id: '' })

    const openPicker = (id, category) => {
        setPickerState({ isOpen: true, category, id })
    }

    const handleSelectPart = (part) => {
        setPart(pickerState.id, part)
        setPickerState({ ...pickerState, isOpen: false })
    }

    return (
        <div className="space-y-20 animate-fade-in pb-20 pt-32">
            {/* Featured Section */}
            <ReadyBuilds />

            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">System Architect</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">PC BUILDER PRO</h1>
                <p className="text-foreground/60 font-medium max-w-2xl text-sm leading-relaxed">
                    Design and validate your high-performance computing system. Our intelligent compatibility engine ensures all components are technically aligned before deployment.
                </p>
            </div>

            {/* Auto Builder Section */}
            <AutoBuilder />

            {/* Main Builder Area */}
            <div className="flex flex-col lg:flex-row gap-12 relative items-start">
                {/* Left: Components Selection */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between border-b border-border-alpha pb-4">
                        <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Component Selection</h3>
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
