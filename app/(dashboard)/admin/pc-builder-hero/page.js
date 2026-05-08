"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export default function PCBuilderHeroSettings() {
    const [videos, setVideos] = useState({ video1: null, video2: null });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Default Fallback Videos
    const defaultVideo1 = "/videos/0508.mp4";
    const defaultVideo2 = "/videos/0508 (2).mp4";

    // File States
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    // Fetch existing settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "pc_builder_hero");
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setVideos(docSnap.data());
                } else {
                    setVideos({ video1: defaultVideo1, video2: defaultVideo2 });
                }
            } catch (err) {
                console.error("Error fetching hero videos:", err);
                // Fallback on error
                setVideos({ video1: defaultVideo1, video2: defaultVideo2 });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleFileChange = (e, videoNumber) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check size
        if (file.size > MAX_FILE_SIZE) {
            setError(`Fayl hajmi 4MB dan oshmasligi kerak. Siz yuklagan fayl: ${(file.size / (1024*1024)).toFixed(2)}MB`);
            return;
        }
        
        setError(null);
        if (videoNumber === 1) setFile1(file);
        if (videoNumber === 2) setFile2(file);
    };

    const handleUpload = async () => {
        if (!file1 && !file2) {
            setError("Yuklash uchun kamida bitta yangi video tanlang!");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);
        setProgress(0);

        try {
            let updatedVideo1 = videos.video1;
            let updatedVideo2 = videos.video2;

            // Upload Video 1
            if (file1) {
                const storageRef1 = ref(storage, `pc_builder_videos/video1_${Date.now()}.mp4`);
                const uploadTask1 = await uploadBytesResumable(storageRef1, file1);
                updatedVideo1 = await getDownloadURL(uploadTask1.ref);
            }

            // Upload Video 2
            if (file2) {
                const storageRef2 = ref(storage, `pc_builder_videos/video2_${Date.now()}.mp4`);
                const uploadTask2 = await uploadBytesResumable(storageRef2, file2);
                updatedVideo2 = await getDownloadURL(uploadTask2.ref);
            }

            // Save to Firestore
            await setDoc(doc(db, "settings", "pc_builder_hero"), {
                video1: updatedVideo1,
                video2: updatedVideo2,
                updatedAt: new Date().toISOString()
            });

            setVideos({ video1: updatedVideo1, video2: updatedVideo2 });
            setSuccess("Videolar muvaffaqiyatli saqlandi va saytda yangilandi!");
            setFile1(null);
            setFile2(null);
            
            // Reset inputs
            document.getElementById('video1-input').value = "";
            document.getElementById('video2-input').value = "";
            
        } catch (err) {
            console.error("Upload error:", err);
            setError("Yuklashda xatolik yuz berdi: " + err.message);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    if (loading) {
        return <div className="p-8">Yuklanmoqda...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-surface p-6 rounded-2xl shadow-sm border border-surface-100">
                <div>
                    <h1 className="text-2xl font-black text-surface-900">PC Builder Hero Videolari</h1>
                    <p className="text-sm text-surface-500 mt-1">PC Builder sahifasidagi 2 ta banner videoni shu yerdan boshqaring.</p>
                </div>
                <button 
                    onClick={handleUpload}
                    disabled={uploading || (!file1 && !file2)}
                    className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                    {uploading ? 'Yuklanmoqda...' : 'Saqlash'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 font-medium">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video 1 Settings */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-surface-100 space-y-4">
                    <h2 className="text-lg font-black text-surface-900">Video 1 (Chap tomon, orqa)</h2>
                    
                    {/* Preview */}
                    <div className="aspect-[9/16] w-full max-w-[200px] mx-auto bg-black rounded-3xl overflow-hidden relative border-4 border-surface-200">
                        {file1 ? (
                            <video src={URL.createObjectURL(file1)} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <video src={videos.video1 || defaultVideo1} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">PREVIEW</div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-surface-700 mb-2">Yangi video yuklash (Max 4MB)</label>
                        <input 
                            id="video1-input"
                            type="file" 
                            accept="video/mp4,video/webm" 
                            onChange={(e) => handleFileChange(e, 1)}
                            className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                        />
                    </div>
                </div>

                {/* Video 2 Settings */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-surface-100 space-y-4">
                    <h2 className="text-lg font-black text-surface-900">Video 2 (O'ng tomon, old)</h2>
                    
                    {/* Preview */}
                    <div className="aspect-[9/16] w-full max-w-[200px] mx-auto bg-black rounded-3xl overflow-hidden relative border-4 border-surface-200">
                        {file2 ? (
                            <video src={URL.createObjectURL(file2)} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <video src={videos.video2 || defaultVideo2} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">PREVIEW</div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-surface-700 mb-2">Yangi video yuklash (Max 4MB)</label>
                        <input 
                            id="video2-input"
                            type="file" 
                            accept="video/mp4,video/webm" 
                            onChange={(e) => handleFileChange(e, 2)}
                            className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 transition-all cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
