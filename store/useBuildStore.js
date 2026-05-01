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
            },
            
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

            autoConfigureBuild: (allProducts, purpose, tier) => {
                const parts = {}
                const idMap = {
                    'Processors': 'cpu', 'Motherboards': 'motherboard', 'Memory': 'ram',
                    'Graphics': 'gpu', 'PSUs': 'psu', 'Cases': 'case',
                    'Storage': 'storage', 'Cooling': 'cooling'
                }

                // Tier-based budget targets
                const budgetMap = {
                    entry: { min: 0, max: 800 },
                    mid: { min: 800, max: 1800 },
                    ultra: { min: 1800, max: 10000 }
                }
                const targetBudget = budgetMap[tier]

                const findBestPart = (category, preference = 'balanced') => {
                    let filtered = allProducts.filter(p => p.category === category)
                    if (filtered.length === 0) return null

                    // Sort by price and performance bias
                    return filtered.sort((a, b) => {
                        const priceA = a.price || 0
                        const priceB = b.price || 0
                        
                        if (tier === 'ultra') return priceB - priceA
                        if (tier === 'entry') return priceA - priceB
                        
                        // Mid tier: try to find something in the middle
                        return Math.abs(priceA - 150) - Math.abs(priceB - 150)
                    })[0]
                }

                // Purpose specific logic overrides
                const cpu = findBestPart('Processors')
                const gpu = purpose === 'office' ? null : findBestPart('Graphics')
                const ram = findBestPart('Memory')
                const mb = findBestPart('Motherboards')
                const storage = findBestPart('Storage')
                const psu = findBestPart('PSUs')
                const pcCase = findBestPart('Cases')
                const cooling = findBestPart('Cooling')

                // Applied logic per purpose
                if (purpose === 'gaming') {
                    // Gaming prioritizes GPU
                    parts.gpu = allProducts.filter(p => p.category === 'Graphics').sort((a,b) => b.price - a.price)[tier === 'ultra' ? 0 : tier === 'mid' ? 1 : 2]
                    parts.cpu = cpu
                    parts.ram = ram
                } else if (purpose === 'creator') {
                    // Creator prioritizes CPU and RAM
                    parts.cpu = allProducts.filter(p => p.category === 'Processors').sort((a,b) => b.price - a.price)[tier === 'ultra' ? 0 : tier === 'mid' ? 1 : 2]
                    parts.ram = allProducts.filter(p => p.category === 'Memory').sort((a,b) => b.price - a.price)[tier === 'ultra' ? 0 : tier === 'mid' ? 1 : 2]
                    parts.gpu = gpu
                } else {
                    // Office prioritizes stability and value
                    parts.cpu = allProducts.filter(p => p.category === 'Processors').sort((a,b) => a.price - b.price)[tier === 'ultra' ? 2 : tier === 'mid' ? 1 : 0]
                    parts.gpu = null // Use integrated graphics
                }

                parts.motherboard = mb
                parts.storage = storage
                parts.psu = psu
                parts.case = pcCase
                parts.cooling = cooling

                set({ selectedParts: parts })
            },

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
                }
            })
        }),
        {
            name: 'onepc-build-storage',
        }
    )
)

export default useBuildStore
