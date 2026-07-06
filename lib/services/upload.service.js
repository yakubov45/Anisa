// Rasmni WebP formatiga siqib hajmini kamaytiradi
const compressToWebP = (file, maxWidth = 1200, quality = 0.82) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;
                if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
                        type: 'image/webp', lastModified: Date.now()
                    }));
                }, 'image/webp', quality);
            };
        };
    });
};

export const uploadService = {
    /**
     * Uploads a file to Cloudflare R2 via presigned URL with WebP compression
     * @param {File} file - The file object to upload
     * @param {string} path - The folder path in storage (e.g. 'products')
     * @param {Function} onProgress - Optional callback for upload progress (0-100)
     * @returns {Promise<string>} The public download URL of the uploaded image
     */
    async uploadImage(file, path = 'products', onProgress = null) {
        if (!file) throw new Error("No file provided");

        if (file.size > 10 * 1024 * 1024) {
            throw new Error("Fayl hajmi 10MB dan katta bo'lmasligi kerak");
        }
        if (!file.type.startsWith('image/')) {
            throw new Error("Faqat rasm fayllari yuklanishi mumkin");
        }

        // Rasmni WebP ga siqish
        console.log(`[R2 Upload] Compressing image to WebP...`);
        const compressed = await compressToWebP(file);
        console.log(`[R2 Upload] ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB saved`);

        return new Promise(async (resolve, reject) => {
            try {
                // 1. Get presigned URL from API
                const response = await fetch('/api/upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: compressed.name,
                        contentType: 'image/webp',
                        folder: path
                    }),
                });

                if (!response.ok) throw new Error("Yuklash uchun manzil olinmadi (API error)");
                
                const { signedUrl, publicUrl } = await response.json();

                // 2. Upload file directly to R2 using XMLHttpRequest to track progress
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', signedUrl, true);
                xhr.setRequestHeader('Content-Type', 'image/webp');
                
                // Track progress
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable && onProgress) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress(progress);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log("[R2 Upload] Success:", publicUrl);
                        resolve(publicUrl);
                    } else {
                        reject(new Error(`Yuklashda xatolik: HTTP ${xhr.status}`));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Tarmoq xatosi yoki yuklash uzildi"));
                };

                xhr.send(compressed);

            } catch (error) {
                console.error("[R2 Upload] Error:", error);
                reject(error);
            }
        });
    }
};
