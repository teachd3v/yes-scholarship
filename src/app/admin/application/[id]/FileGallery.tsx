'use client'

import { useState } from 'react';
import { ExternalLink, FileText, X, ZoomIn } from 'lucide-react';

interface FileItem {
    label: string;
    url?: string;
}

interface FileGalleryProps {
    title: string;
    files: FileItem[];
    gridCols?: number;
}

export default function FileGallery({ title, files, gridCols = 3 }: FileGalleryProps) {
    const [selectedFile, setSelectedFile] = useState<{ url: string, type: 'image' | 'pdf' } | null>(null);

    const validFiles = files.filter(f => f.url);

    if (validFiles.length === 0) return null;

    const getFileType = (url: string) => {
        try {
            const cleanUrl = url.split('?')[0].toLowerCase();
            if (cleanUrl.endsWith('.pdf')) return 'pdf';
            return 'image'; // Default to image
        } catch (e) {
            return 'image';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
            
            <div className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-4`}>
                {validFiles.map((file, idx) => {
                    const type = getFileType(file.url!);
                    
                    return (
                        <div key={idx} className="group relative border border-slate-200 rounded-lg p-2 bg-slate-50 hover:bg-white transition hover:shadow-md flex flex-col">
                            
                            {/* Header Label */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-600 truncate max-w-[80%]" title={file.label}>
                                    {file.label}
                                </span>
                                <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                                    title="Buka di tab baru"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 flex flex-col h-32 md:h-40">
                                {type === 'image' ? (
                                    <div 
                                        className="relative w-full h-full bg-gray-200 rounded-md overflow-hidden cursor-pointer group/image"
                                        onClick={() => setSelectedFile({ url: file.url!, type: 'image' })}
                                    >
                                        <img 
                                            src={file.url!} 
                                            alt={file.label} 
                                            className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/image:bg-black/20 transition-colors">
                                            <ZoomIn className="text-white opacity-0 group-hover/image:opacity-100 transition-opacity drop-shadow-md" size={24} />
                                        </div>
                                    </div>
                                ) : (
                                     <div 
                                        className="relative w-full h-full bg-white border border-slate-200 rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition group/pdf"
                                        onClick={() => setSelectedFile({ url: file.url!, type: 'pdf' })}
                                    >
                                        <div className="p-3 bg-red-100 rounded-full text-red-600 group-hover/pdf:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">PDF Dokumen</span>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/pdf:bg-black/5 transition-colors rounded-md">
                                            <ZoomIn className="text-slate-700 opacity-0 group-hover/pdf:opacity-100 transition-opacity drop-shadow-sm" size={20} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Lightbox */}
            {selectedFile && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedFile(null)}
                >
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 rounded-full p-2 transition z-[101] shadow-lg"
                        title="Close"
                    >
                        <X size={24} />
                    </button>
                    
                    <div 
                        className="relative w-full max-w-6xl h-[85vh] flex items-center justify-center rounded-lg overflow-hidden" 
                        onClick={e => e.stopPropagation()}
                        style={{ backgroundColor: selectedFile.type === 'image' ? 'transparent' : 'white' }}
                    >
                        {selectedFile.type === 'image' ? (
                            <img 
                                src={selectedFile.url} 
                                alt="Preview" 
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <iframe 
                                src={selectedFile.url} 
                                className="w-full h-full rounded-lg bg-white"
                                title="PDF Preview"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
