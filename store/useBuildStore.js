import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useBuildStore = create(
    persist(
        (set, get) => ({
            selectedParts: {
                cpu: null,
                motherboard: null,
                ram: null,
                gpu: null,
                storage: null,
                psu: null,
                case: null,
                cooling: null,
                // Peripherals & Furniture
                monitor: null,
                mouse: null,
                keyboard: null,
                headphones: null,
                chair: null,
                desk: null,
            },
            buildMode: 'case_only', // 'case_only' or 'full_set'
            setBuildMode: (mode) => set({ buildMode: mode }),
            
            setPart: (category, part) => set((state) => ({
                selectedParts: {
                    ...state.selectedParts,
                    [category]: part
                }
            })),

            removePart: (category) => set((state) => ({
                selectedParts: {
                    ...state.selectedParts,
                    [category]: null
                }
            })),

            resetBuild: () => set({
                selectedParts: {
                    cpu: null,
                    motherboard: null,
                    ram: null,
                    gpu: null,
                    storage: null,
                    psu: null,
                    case: null,
                    cooling: null,
                    monitor: null,
                    mouse: null,
                    keyboard: null,
                    headphones: null,
                    chair: null,
                    desk: null,
                }
            }),

            // Total Price Calculation
            getTotalPrice: () => {
                const parts = get().selectedParts
                return Object.values(parts).reduce((total, part) => {
                    return total + (part?.price || 0)
                }, 0)
            },

            // Progress Calculation
            getProgress: () => {
                const parts = get().selectedParts
                const selectedCount = Object.values(parts).filter(p => p !== null).length
                const totalCount = Object.keys(parts).length
                return { count: selectedCount, total: totalCount, percent: (selectedCount / totalCount) * 100 }
            },

            // Compatibility Logic
            getCompatibilityIssues: () => {
                const { cpu, motherboard, ram, psu, gpu, case: pcCase } = get().selectedParts
                const issues = []

                // CPU & Motherboard Socket Check
                if (cpu && motherboard) {
                    if (cpu.socket !== motherboard.socket) {
                        issues.push({
                            type: 'error',
                            message: `Socket Mismatch: ${cpu.name} (${cpu.socket}) requires a ${cpu.socket} motherboard.`
                        })
                    }
                }

                // RAM & Motherboard DDR Check
                if (ram && motherboard) {
                    if (ram.ddr !== motherboard.ddr) {
                        issues.push({
                            type: 'error',
                            message: `Memory Incompatible: ${motherboard.name} supports ${motherboard.ddr}, but you selected ${ram.ddr}.`
                        })
                    }
                }

                // Motherboard & Case Form Factor Check
                if (motherboard && pcCase) {
                    const formFactorScores = { 'ATX': 3, 'mATX': 2, 'ITX': 1 }
                    if (formFactorScores[motherboard.formFactor] > formFactorScores[pcCase.maxFormFactor]) {
                        issues.push({
                            type: 'error',
                            message: `Chassis Size: ${pcCase.name} is too small for an ${motherboard.formFactor} motherboard.`
                        })
                    }
                }

                // PSU Wattage Check
                if (psu) {
                    const estimatedWattage = (cpu?.tdp || 100) + (gpu?.tdp || 250) + 150 // 150W buffer
                    if (psu.wattage < estimatedWattage) {
                        issues.push({
                            type: 'warning',
                            message: `Power Warning: Estimated load ~${estimatedWattage}W exceeds your PSU capacity.`
                        })
                    }
                }

                return issues
            },

            autoConfigureBuild: (allProducts, purpose, tier, mode = 'case_only') => {
                const parts = {
                    cpu: null, motherboard: null, ram: null, gpu: null,
                    storage: null, psu: null, case: null, cooling: null,
                    monitor: null, mouse: null, keyboard: null, headphones: null, chair: null, desk: null
                }

                // Tier-based budget targets (Optimized for UZS/USD reality)
                const budgetMap = {
                    gaming: { entry: 500, mid: 1200, ultra: 3500 },
                    creator: { entry: 600, mid: 1500, ultra: 4500 },
                    office: { entry: 300, mid: 600, ultra: 1000 }
                }
                
                let targetPrice = budgetMap[purpose][tier]
                if (mode === 'full_set') targetPrice = targetPrice * 1.5 
                
                // Helper to find parts within a specific price bracket
                const findPart = (category, weight, constraints = {}) => {
                    const priceLimit = targetPrice * weight
                    let filtered = allProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase())
                    
                    // 1. Apply strict compatibility constraints
                    Object.entries(constraints).forEach(([key, value]) => {
                        if (value) {
                            filtered = filtered.filter(p => {
                                const pVal = p[key]?.toString().toLowerCase().trim()
                                const cVal = value.toString().toLowerCase().trim()
                                return pVal === cVal
                            })
                        }
                    })

                    if (filtered.length === 0) {
                        filtered = allProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase())
                    }

                    // 2. Sort Logic: Entry tier always picks the CHEAPEST compatible part.
                    // Mid and Ultra tiers try to match the budget weight.
                    return filtered.sort((a, b) => {
                        if (tier === 'entry') return a.price - b.price;
                        
                        const diffA = Math.abs(a.price - priceLimit)
                        const diffB = Math.abs(b.price - priceLimit)
                        return diffA - diffB
                    })[0]
                }

                // 1. Core Components
                parts.cpu = findPart('Processors', purpose === 'creator' ? 0.2 : 0.15)
                parts.motherboard = findPart('Motherboards', 0.1, { socket: parts.cpu?.socket })
                parts.ram = findPart('Memory', 0.08, { ddr: parts.motherboard?.ddr })
                if (purpose !== 'office') {
                    parts.gpu = findPart('Graphics', purpose === 'gaming' ? 0.35 : 0.2)
                }
                parts.storage = findPart('Storage', 0.06)
                
                const mbForm = parts.motherboard?.formFactor || 'ATX'
                parts.case = allProducts.filter(p => p.category?.toLowerCase() === 'cases').sort((a,b) => a.price - b.price).find(p => {
                    const formFactorScores = { 'ATX': 3, 'mATX': 2, 'ITX': 1 }
                    return formFactorScores[p.maxFormFactor] >= formFactorScores[mbForm]
                }) || findPart('Cases', 0.05)

                const estWattage = (parts.cpu?.tdp || 100) + (parts.gpu?.tdp || 250) + 150
                parts.psu = allProducts.filter(p => p.category?.toLowerCase() === 'psus' && p.wattage >= estWattage).sort((a,b) => a.price - b.price)[0] || findPart('PSUs', 0.05)
                parts.cooling = findPart('Cooling', 0.04)

                // 2. Peripherals (only if full_set)
                if (mode === 'full_set') {
                    parts.monitor = findPart('Monitors', 0.15)
                    parts.keyboard = findPart('Klaviaturalar', 0.05)
                    parts.mouse = findPart('Sichqonchalar', 0.04)
                    parts.headphones = findPart('Quloqchinlar', 0.05)
                    parts.chair = findPart('Chairs', 0.08)
                    parts.desk = findPart('Desks', 0.08)
                }

                set({ selectedParts: parts })
            },

        }),
        {
            name: 'onepc-build-storage',
        }
    )
)

export default useBuildStore
