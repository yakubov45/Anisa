import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/client";

export const uploadService = {
    /**
     * Uploads a file to Firebase Storage
     * @param {File} file - The file object to upload
     * @param {string} path - The folder path in storage (e.g. 'products')
     * @param {Function} onProgress - Optional callback for upload progress (0-100)
     * @returns {Promise<string>} The download URL of the uploaded image
     */
    async uploadImage(file, path = 'products', onProgress = null) {
        if (!file) throw new Error("No file provided");
        
        // File size check (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error("Fayl hajmi 10MB dan katta bo'lmasligi kerak");
        }

        // File type check
        if (!file.type.startsWith('image/')) {
            throw new Error("Faqat rasm fayllari yuklanishi mumkin");
        }
        
        console.log(`[Upload] Starting upload via Firebase Storage to folder: ${path}`);
        
        return new Promise((resolve, reject) => {
            // Generate a unique file name
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = ref(storage, `${path}/${fileName}`);
            
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    if (onProgress) {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        onProgress(progress);
                        console.log(`[Upload] Progress: ${Math.round(progress)}%`);
                    }
                },
                (error) => {
                    console.error("[Upload] Error:", error);
                    reject(new Error("Rasm yuklashda xatolik yuz berdi"));
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("[Upload] Success:", downloadURL);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error("[Upload] URL Error:", error);
                        reject(new Error("Rasm manzilini olishda xatolik"));
                    }
                }
            );
        });
    }
};
