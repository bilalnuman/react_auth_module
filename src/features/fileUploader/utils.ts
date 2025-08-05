export const isDuplicate = (existingFiles: File[], newFile: File): boolean => {
    return existingFiles.some(file => file.name === newFile.name && file.size === newFile.size);
};

export const validateFile = async (
    file: File,
    allowedTypes: string[],
    maxSizeMB: number,
    maxDimensions?: { width: number; height: number }
): Promise<boolean> => {
    if (allowedTypes.length && !allowedTypes.includes(file.type)) return false;
    if (file.size > maxSizeMB * 1024 * 1024) return false;

    if (file.type.startsWith('image/') && maxDimensions) {
        return await checkImageDimensions(file, maxDimensions);
    }

    return true;
};

const checkImageDimensions = (
    file: File,
    { width, height }: { width: number; height: number }
): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve(img.width <= width && img.height <= height);
        };
        img.onerror = () => resolve(false);
        img.src = URL.createObjectURL(file);
    });
};
