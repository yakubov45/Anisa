export const uploadService = {
    /**
     * Uploads a file to ImageKit
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
        
        console.log(`[Upload] Starting upload via ImageKit to folder: ${path}`);
        
        try {
            // 1. API orqali signature va token olish (Auth)
            const authResponse = await fetch('/api/imagekit/auth');
            if (!authResponse.ok) {
                throw new Error("ImageKit auth error");
            }
            const authData = await authResponse.json();
            const { token, expire, signature } = authData;

            // 2. FormData tayyorlash
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("folder", `/${path}`);
            formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
            formData.append("signature", signature);
            formData.append("expire", expire);
            formData.append("token", token);

            // 3. XMLHttpRequest orqali yuklash (progressni kuzatish uchun)
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

                xhr.upload.addEventListener("progress", (e) => {
                    if (e.lengthComputable && onProgress) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                        console.log(`[Upload] Progress: ${Math.round(percentComplete)}%`);
                    }
                });

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        console.log("[Upload] Success:", response.url);
                        resolve(response.url); // Muvaffaqiyatli yuklangan manzilni qaytaradi
                    } else {
                        console.error("[Upload] Error:", xhr.responseText);
                        reject(new Error("Rasm yuklashda xatolik yuz berdi"));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Tarmoq xatosi"));
                };

                xhr.send(formData);
            });

        } catch (error) {
            console.error("[Upload] Exception:", error);
            throw error;
        }
    }
};
