import React, { useRef, useState } from 'react';
import styles from './FileUploader.module.css';
import { isDuplicate, validateFile } from './utils';

type Dimensions = { width: number; height: number };
type fileMeta = { size?: boolean, name?: boolean, type?: boolean };

interface FileUploaderProps {
    multiple?: boolean;
    allowedTypes?: string[];
    maxFileSizeMB?: number;
    maxDimensions?: Dimensions;
    showProgress?: boolean;
    showPreview?: boolean;
    onFilesChange?: (files: File[]) => void;
    onDbFilesChange?: (urls: string[]) => void;
    dbFileUrls?: string[];
    fileMeta?: fileMeta;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    multiple = false,
    allowedTypes = [],
    maxFileSizeMB = 5,
    maxDimensions,
    fileMeta,
    showProgress = false,
    showPreview = false,
    onFilesChange,
    onDbFilesChange,
    dbFileUrls = [],
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fmtSize = (size: number) =>
        size < 1024 ? `${size} bytes`
            : size < 1024 ** 2 ? `${(size / 1024).toFixed(1)} KB`
                : `${(size / 1024 ** 2).toFixed(2)} MB`;

    const handleFiles = async (incoming: FileList | null) => {
        if (!incoming) return;
        const list = Array.from(incoming);
        const newFiles: File[] = [];

        for (const f of list) {
            if (isDuplicate(files, f)) {
                alert(`File "${f.name}" is already selected.`);
                continue;
            }
            const ok = await validateFile(f, allowedTypes, maxFileSizeMB, maxDimensions);
            if (ok) newFiles.push(f);
        }

        const updated = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
        setFiles(updated);
        onFilesChange?.(updated);
    };

    const removeAt = (i: number) => {
        const updated = [...files];
        updated.splice(i, 1);
        setFiles(updated);
        onFilesChange?.(updated);
    };

    const removeDbFileAt = (i: number) => {
        const updated = [...dbFileUrls];
        updated.splice(i, 1);
        onDbFilesChange?.(updated);
    };

    const renderThumbnail = (file: File | string) => {
        const isURL = typeof file === 'string';
        const url = isURL ? file : URL.createObjectURL(file);
        const type = isURL ? '' : (file as File).type;

        const handlePreview = () => {
            if (showPreview) setPreviewUrl(url);
        };

        // Detect images
        if (!isURL && type.startsWith('image/')) {
            return <img src={url} alt="" onClick={handlePreview} style={{ cursor: showPreview ? "pointer" : "default" }} />;
        }
        if (isURL && url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
            return <img src={url} alt="" onClick={handlePreview} style={{ cursor: showPreview ? "pointer" : "default" }} />;
        }

        // Detect videos
        if (!isURL && type.startsWith('video/')) {
            return <video src={url} onClick={handlePreview} controls style={{ maxHeight: 100 }} />;
        }
        if (isURL && url.match(/\.(mp4|webm)(\?.*)?$/i)) {
            return <video src={url} onClick={handlePreview} controls style={{ maxHeight: 100 }} />;
        }

        // Detect PDF
        if (isURL && url.match(/\.pdf(\?.*)?$/i)) {
            return <div style={{ height: 80, lineHeight: '80px' }}>📄</div>;
        }

        return <div style={{ height: 80, lineHeight: '80px' }}>📁</div>;
    };


    return (
        <>
            <div
                className={styles.container}
                onClick={() => fileInputRef.current?.click()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                onDragOver={e => e.preventDefault()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    multiple={multiple}
                    accept={allowedTypes.join(',')}
                    onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                />
                <p>Drag or click to upload</p>

                <div className={styles.gallery}>
                    {/* ✅ Render DB files (read-only or deletable) */}
                    {dbFileUrls.map((url, i) => (
                        <div className={styles.item} key={`db-${i}`} onClick={e => e.stopPropagation()}>
                            {renderThumbnail(url)}
                            <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); removeDbFileAt(i); }}>✕</button>
                            {showProgress && <progress value="100" max="100" />}
                        </div>
                    ))}

                    {/* ✅ Render new uploaded files */}
                    {files.map((f, i) => (
                        <div className={styles.item} key={`file-${i}`} onClick={e => e.stopPropagation()}>
                            {renderThumbnail(f)}
                            <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); removeAt(i); }}>✕</button>
                            {fileMeta &&
                                <div className={styles.metadata}>
                                    {fileMeta.name && <div>{f.name}</div>}
                                    {fileMeta.type && <div>{f.type || '—'}</div>}
                                    {fileMeta.size && <div>{fmtSize(f.size)}</div>}
                                </div>
                            }
                            {showProgress && <progress value="100" max="100" />}
                        </div>
                    ))}
                </div>

                {/* ✅ Preview modal */}
                {previewUrl && showPreview && (
                    <div className={styles.modalOverlay} onClick={() => setPreviewUrl(null)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            {previewUrl.match(/\.(mp4|webm)$/)
                                ? <video src={previewUrl} controls style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                                : <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />}
                            <div className={styles.closeModal} onClick={e => { e.stopPropagation(); setPreviewUrl(null); }}>Close</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FileUploader;

