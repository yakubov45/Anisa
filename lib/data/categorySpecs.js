export const categorySpecs = {
    mice: {
        id: "mice",
        name: "Sichqoncha (Mouse)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Color", type: "text" },
            { name: "Connection Type", type: "select", options: ["Wired", "Wireless 2.4GHz", "Bluetooth", "Multi-device"] },
            { name: "Sensor Type", type: "select", options: ["Optical", "Laser"] },
            { name: "DPI", type: "number", unit: "DPI" },
            { name: "Max DPI", type: "number", unit: "DPI" },
            { name: "Polling Rate", type: "select", options: ["125Hz", "500Hz", "1000Hz", "4000Hz", "8000Hz"] },
            { name: "Buttons Count", type: "number" },
            { name: "Programmable Buttons", type: "boolean" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Weight", type: "number", unit: "g" },
            { name: "Battery Life", type: "number", unit: "hours" },
            { name: "Charging Type", type: "select", options: ["USB-C", "Micro-USB", "Wireless Charging", "AA/AAA Battery"] },
            { name: "Wireless Range", type: "number", unit: "m" },
            { name: "Grip Type", type: "select", options: ["Palm", "Claw", "Fingertip", "Universal"] },
            { name: "Compatibility", type: "multiselect", options: ["Windows", "macOS", "Linux", "Xbox", "PlayStation"] },
            { name: "Warranty", type: "text" }
        ]
    },
    keyboards: {
        id: "keyboards",
        name: "Klaviatura (Keyboard)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Layout", type: "select", options: ["ANSI", "ISO", "JIS"] },
            { name: "Size Format", type: "select", options: ["100% (Full Size)", "TKL (80%)", "75%", "65%", "60%", "40%", "Macropad"] },
            { name: "Switch Type", type: "select", options: ["Mechanical", "Membrane", "Optical", "Mecha-Membrane", "Low Profile"] },
            { name: "Switch Brand", type: "text" },
            { name: "Hot Swap", type: "boolean" },
            { name: "Connection Type", type: "select", options: ["Wired", "Wireless 2.4GHz", "Bluetooth", "Multi-device"] },
            { name: "Wireless", type: "boolean" },
            { name: "Battery Life", type: "number", unit: "hours" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Keycaps Material", type: "select", options: ["ABS", "PBT", "Pudding", "Double-shot", "Ceramic"] },
            { name: "Anti Ghosting", type: "boolean" },
            { name: "Polling Rate", type: "select", options: ["125Hz", "500Hz", "1000Hz", "4000Hz", "8000Hz"] },
            { name: "Wrist Rest", type: "boolean" },
            { name: "Multimedia Keys", type: "boolean" },
            { name: "Language Layout", type: "text", tooltip: "e.g. US, UK, RU" },
            { name: "Compatibility", type: "multiselect", options: ["Windows", "macOS", "Linux", "Xbox", "PlayStation"] },
            { name: "Cable Type", type: "text" },
            { name: "Warranty", type: "text" }
        ]
    },
    monitors: {
        id: "monitors",
        name: "Monitor",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Screen Size", type: "number", unit: "inch" },
            { name: "Resolution", type: "select", options: ["1920x1080 (FHD)", "2560x1440 (QHD)", "3840x2160 (4K)", "5120x1440", "Other"] },
            { name: "Refresh Rate", type: "number", unit: "Hz" },
            { name: "Panel Type", type: "select", options: ["IPS", "VA", "TN", "OLED", "Mini-LED"] },
            { name: "Response Time", type: "number", unit: "ms" },
            { name: "Aspect Ratio", type: "select", options: ["16:9", "21:9", "32:9"] },
            { name: "Brightness", type: "number", unit: "nits" },
            { name: "HDR", type: "text", tooltip: "e.g. HDR400, HDR1000" },
            { name: "Color Accuracy", type: "text", tooltip: "e.g. 100% sRGB, 95% DCI-P3" },
            { name: "G Sync", type: "boolean" },
            { name: "FreeSync", type: "boolean" },
            { name: "Ports", type: "multiselect", options: ["HDMI 2.0", "HDMI 2.1", "DisplayPort 1.4", "DisplayPort 2.1", "USB-C", "USB Hub"] },
            { name: "Curved", type: "boolean" },
            { name: "Speakers", type: "boolean" },
            { name: "VESA Support", type: "boolean" },
            { name: "Power Consumption", type: "number", unit: "W" },
            { name: "Warranty", type: "text" }
        ]
    },
    chairs: {
        id: "chairs",
        name: "Gaming Chair",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Color", type: "text" },
            { name: "Material", type: "select", options: ["PU Leather", "Fabric", "Mesh", "Real Leather"] },
            { name: "Max Weight", type: "number", unit: "kg" },
            { name: "Adjustable Armrest", type: "select", options: ["None", "1D", "2D", "3D", "4D"] },
            { name: "Lumbar Support", type: "boolean" },
            { name: "Head Pillow", type: "boolean" },
            { name: "Recline Angle", type: "number", unit: "degrees" },
            { name: "Height Adjustment", type: "boolean" },
            { name: "Wheel Type", type: "text" },
            { name: "Frame Material", type: "select", options: ["Steel", "Aluminum", "Plastic", "Wood"] },
            { name: "Seat Width", type: "number", unit: "cm" },
            { name: "Seat Depth", type: "number", unit: "cm" },
            { name: "Warranty", type: "text" }
        ]
    },
    desks: {
        id: "desks",
        name: "Stol (Desk)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Color", type: "text" },
            { name: "Material", type: "text" },
            { name: "Dimensions", type: "text", tooltip: "e.g. 120x60x75 cm" },
            { name: "Weight Capacity", type: "number", unit: "kg" },
            { name: "Adjustable Height", type: "boolean" },
            { name: "Electric Motor", type: "boolean" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Cable Management", type: "boolean" },
            { name: "Cup Holder", type: "boolean" },
            { name: "Headphone Hook", type: "boolean" },
            { name: "Surface Type", type: "select", options: ["Carbon Fiber", "Wood", "Glass", "Plastic"] },
            { name: "Warranty", type: "text" }
        ]
    },
    headsets: {
        id: "headsets",
        name: "Quloqchin (Headset)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Connection Type", type: "select", options: ["Wired 3.5mm", "Wired USB", "Wireless 2.4GHz", "Bluetooth"] },
            { name: "Wireless", type: "boolean" },
            { name: "Driver Size", type: "number", unit: "mm" },
            { name: "Frequency Response", type: "text", tooltip: "e.g. 20Hz - 20kHz" },
            { name: "Microphone", type: "boolean" },
            { name: "Noise Cancellation", type: "select", options: ["None", "Passive", "Active (ANC)"] },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Battery Life", type: "number", unit: "hours" },
            { name: "Charging Type", type: "select", options: ["USB-C", "Micro-USB"] },
            { name: "Weight", type: "number", unit: "g" },
            { name: "Compatibility", type: "multiselect", options: ["Windows", "macOS", "Xbox", "PlayStation", "Mobile"] },
            { name: "Surround Sound", type: "select", options: ["Stereo", "7.1 Virtual", "Dolby Atmos", "Spatial Audio"] },
            { name: "Warranty", type: "text" }
        ]
    },
    microphones: {
        id: "microphones",
        name: "Mikrofon",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Microphone Type", type: "select", options: ["Condenser", "Dynamic", "Ribbon"] },
            { name: "Polar Pattern", type: "select", options: ["Cardioid", "Omnidirectional", "Bidirectional", "Stereo", "Switchable"] },
            { name: "Connection Type", type: "select", options: ["USB", "XLR", "3.5mm"] },
            { name: "Sample Rate", type: "text", tooltip: "e.g. 48kHz, 96kHz, 192kHz" },
            { name: "Bit Depth", type: "text", tooltip: "e.g. 16-bit, 24-bit" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Mute Button", type: "boolean" },
            { name: "Compatibility", type: "multiselect", options: ["Windows", "macOS", "PlayStation"] },
            { name: "Mount Included", type: "boolean" },
            { name: "Warranty", type: "text" }
        ]
    },
    webcams: {
        id: "webcams",
        name: "Webcam",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Resolution", type: "select", options: ["720p", "1080p", "1440p", "4K"] },
            { name: "FPS", type: "select", options: ["30 FPS", "60 FPS", "120 FPS"] },
            { name: "Autofocus", type: "boolean" },
            { name: "Microphone", type: "boolean" },
            { name: "Connection Type", type: "select", options: ["USB-A", "USB-C"] },
            { name: "Privacy Shutter", type: "boolean" },
            { name: "Low Light Correction", type: "boolean" },
            { name: "Field of View", type: "number", unit: "degrees" },
            { name: "Compatibility", type: "multiselect", options: ["Windows", "macOS"] },
            { name: "Warranty", type: "text" }
        ]
    },
    Graphics: {
        id: "Graphics",
        name: "GPU (Videokarta)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "GPU Chipset", type: "text" },
            { name: "VRAM", type: "number", unit: "GB" },
            { name: "Memory Type", type: "select", options: ["GDDR6", "GDDR6X", "HBM2"] },
            { name: "Memory Bus", type: "number", unit: "bit" },
            { name: "Core Clock", type: "number", unit: "MHz" },
            { name: "Boost Clock", type: "number", unit: "MHz" },
            { name: "CUDA Cores", type: "number" },
            { name: "TDP", type: "number", unit: "W" },
            { name: "Recommended PSU", type: "number", unit: "W" },
            { name: "Power Connectors", type: "text", tooltip: "e.g. 1x 8-pin, 2x 8-pin, 1x 16-pin" },
            { name: "Length", type: "number", unit: "mm" },
            { name: "Cooling Type", type: "select", options: ["Air", "AIO Liquid", "Custom Loop", "Passive"] },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Ports", type: "multiselect", options: ["HDMI 2.1", "DisplayPort 1.4a", "DisplayPort 2.1", "USB-C"] },
            { name: "Ray Tracing", type: "boolean" },
            { name: "DLSS Support", type: "boolean" },
            { name: "Warranty", type: "text" }
        ]
    },
    Processors: {
        id: "Processors",
        name: "CPU (Protsessor)",
        parameters: [
            { name: "Brand", type: "select", options: ["Intel", "AMD", "Apple"] },
            { name: "Model", type: "text" },
            { name: "Socket", type: "text" },
            { name: "Cores", type: "number" },
            { name: "Threads", type: "number" },
            { name: "Base Clock", type: "number", unit: "GHz" },
            { name: "Boost Clock", type: "number", unit: "GHz" },
            { name: "Cache", type: "number", unit: "MB" },
            { name: "TDP", type: "number", unit: "W" },
            { name: "Integrated Graphics", type: "boolean" },
            { name: "Architecture", type: "text" },
            { name: "Cooler Included", type: "boolean" },
            { name: "Overclock Support", type: "boolean" },
            { name: "Warranty", type: "text" }
        ]
    },
    Motherboards: {
        id: "Motherboards",
        name: "Motherboard",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Socket", type: "text" },
            { name: "Chipset", type: "text" },
            { name: "Form Factor", type: "select", options: ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"] },
            { name: "RAM Type", type: "select", options: ["DDR4", "DDR5"] },
            { name: "Max RAM", type: "number", unit: "GB" },
            { name: "RAM Slots", type: "number" },
            { name: "PCIe Version", type: "select", options: ["PCIe 3.0", "PCIe 4.0", "PCIe 5.0"] },
            { name: "M2 Slots", type: "number" },
            { name: "SATA Ports", type: "number" },
            { name: "WiFi", type: "boolean" },
            { name: "Bluetooth", type: "boolean" },
            { name: "RGB Header", type: "boolean" },
            { name: "USB Ports", type: "number" },
            { name: "LAN Speed", type: "select", options: ["1Gbps", "2.5Gbps", "10Gbps"] },
            { name: "Warranty", type: "text" }
        ]
    },
    Memory: {
        id: "Memory",
        name: "RAM",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Capacity", type: "number", unit: "GB" },
            { name: "RAM Type", type: "select", options: ["DDR4", "DDR5"] },
            { name: "Speed", type: "number", unit: "MHz" },
            { name: "Latency", type: "text", tooltip: "e.g. CL16, CL30" },
            { name: "Voltage", type: "number", unit: "V" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Heat Spreader", type: "boolean" },
            { name: "Modules Count", type: "number", tooltip: "e.g. 2 for 2x16GB" },
            { name: "Warranty", type: "text" }
        ]
    },
    Storage: {
        id: "Storage",
        name: "Storage (SSD/HDD)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Type", type: "select", options: ["NVMe SSD", "SATA SSD", "HDD"] },
            { name: "Capacity", type: "number", unit: "GB" },
            { name: "Form Factor", type: "select", options: ["M.2 2280", "2.5 inch", "3.5 inch", "PCIe Add-in Card"] },
            { name: "Interface", type: "select", options: ["PCIe 3.0", "PCIe 4.0", "PCIe 5.0", "SATA III"] },
            { name: "Read Speed", type: "number", unit: "MB/s" },
            { name: "Write Speed", type: "number", unit: "MB/s" },
            { name: "TBW", type: "number", tooltip: "TeraBytes Written" },
            { name: "DRAM Cache", type: "boolean" },
            { name: "RPM (For HDD)", type: "number", unit: "RPM" },
            { name: "Warranty", type: "text" }
        ]
    },
    PSUs: {
        id: "PSUs",
        name: "PSU (Blok Pitaniya)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Wattage", type: "number", unit: "W" },
            { name: "Efficiency Rating", type: "select", options: ["80+ White", "80+ Bronze", "80+ Silver", "80+ Gold", "80+ Platinum", "80+ Titanium"] },
            { name: "Modular", type: "select", options: ["Non-Modular", "Semi-Modular", "Full-Modular"] },
            { name: "PCIe Connectors", type: "number" },
            { name: "Cooling Fan Size", type: "number", unit: "mm" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Protection Features", type: "multiselect", options: ["OVP", "UVP", "OPP", "OTP", "SCP", "OCP"] },
            { name: "Warranty", type: "text" }
        ]
    },
    Cases: {
        id: "Cases",
        name: "Case (Korpus)",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Case Type", type: "select", options: ["Mid Tower", "Full Tower", "Mini ITX", "Micro ATX"] },
            { name: "Motherboard Support", type: "multiselect", options: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"] },
            { name: "GPU Clearance", type: "number", unit: "mm" },
            { name: "CPU Cooler Clearance", type: "number", unit: "mm" },
            { name: "PSU Support", type: "select", options: ["ATX", "SFX", "SFX-L"] },
            { name: "Fans Included", type: "number" },
            { name: "Radiator Support", type: "multiselect", options: ["120mm", "240mm", "280mm", "360mm", "420mm"] },
            { name: "Tempered Glass", type: "boolean" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Front Panel Ports", type: "text" },
            { name: "Cable Management", type: "boolean" },
            { name: "Warranty", type: "text" }
        ]
    },
    Cooling: {
        id: "Cooling",
        name: "Cooling System",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "Cooling Type", type: "select", options: ["Air Cooler", "AIO Liquid Cooler", "Case Fan"] },
            { name: "Radiator Size", type: "select", options: ["None", "120mm", "240mm", "280mm", "360mm", "420mm"] },
            { name: "Fan Speed", type: "text", tooltip: "e.g. 500-2000 RPM" },
            { name: "Noise Level", type: "number", unit: "dBA" },
            { name: "RGB Lighting", type: "boolean" },
            { name: "Socket Compatibility", type: "multiselect", options: ["LGA 1700", "LGA 1200", "AM4", "AM5"] },
            { name: "Warranty", type: "text" }
        ]
    },
    laptops: {
        id: "laptops",
        name: "Notebook",
        parameters: [
            { name: "Brand", type: "text" },
            { name: "Model", type: "text" },
            { name: "CPU", type: "text" },
            { name: "GPU", type: "text" },
            { name: "RAM", type: "number", unit: "GB" },
            { name: "Storage", type: "text" },
            { name: "Display Size", type: "number", unit: "inch" },
            { name: "Resolution", type: "text" },
            { name: "Refresh Rate", type: "number", unit: "Hz" },
            { name: "Battery Capacity", type: "number", unit: "Wh" },
            { name: "Weight", type: "number", unit: "kg" },
            { name: "Keyboard Backlight", type: "boolean" },
            { name: "Ports", type: "text" },
            { name: "WiFi", type: "select", options: ["WiFi 5", "WiFi 6", "WiFi 6E", "WiFi 7"] },
            { name: "Bluetooth", type: "text" },
            { name: "Operating System", type: "select", options: ["Windows 11", "Windows 10", "macOS", "Linux", "DOS", "None"] },
            { name: "Warranty", type: "text" }
        ]
    }
};
