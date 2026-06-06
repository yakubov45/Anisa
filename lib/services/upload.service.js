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
        
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storageRef = ref(storage, `${path}/${timestamp}_${safeName}`);
        
        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    if (onProgress) {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        onProgress(progress);
                    }
                },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }
};
