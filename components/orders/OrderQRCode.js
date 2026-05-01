"use client";

import { QRCodeSVG } from 'qrcode.react';

/**
 * Renders a secure QR code for order verification.
 * Data includes orderId and the verification token.
 */
export default function OrderQRCode({ orderId, token, size = 200, isHighValue = false }) {
    if (!orderId || !token) return null;

    const qrData = JSON.stringify({
        orderId,
        token
    });

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-4 border-primary/10 inline-block animate-fade-in relative">
            {isHighValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg z-20 whitespace-nowrap">
                    ⚠️ OTP Required for Delivery
                </div>
            )}
            
            <div className="relative group">
                <QRCodeSVG 
                    value={qrData} 
                    size={size}
                    level="H"
                    includeMargin={false}
                    className="rounded-lg transition-transform group-hover:scale-[1.02]"
                />
                
                {/* Visual Overlay for branding */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none grayscale">
                     <span className="text-4xl font-black">ONEPC</span>
                </div>
            </div>
            
            <div className="mt-6 text-center space-y-1">
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Deployment Protocol</p>
                <p className="text-xs font-black text-primary uppercase tracking-widest">{orderId}</p>
            </div>
        </div>
    );
}
