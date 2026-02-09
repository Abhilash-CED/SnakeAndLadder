'use client';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SnakeInfoModal = ({ isOpen, snakeInfo, onClose }) => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!isOpen || !snakeInfo) return null;

    const { name, description, images = [], thumbnails = [] } = snakeInfo;

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="max-h-[85vh] mt-6 bg-slate-900 border border-red-500/50 rounded-xl shadow-2xl max-w-2xl w-full overflow-y-auto animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-red-900/80 p-4 flex justify-between items-center border-b border-red-800">
                    <h4 className="text-xl font-bold text-white uppercase tracking-wider">{t('snake_info_title')}</h4>
                    <button
                        onClick={onClose}
                        className="text-red-200 hover:text-white bg-red-950/50 hover:bg-red-800 rounded-lg px-3 py-1 transition"
                    >
                        <X size={20} className='text-xl font-bold' />
                    </button>
                </div>

                <div className="p-6">
                    <h4 className="text-2xl font-bold text-red-400 mb-2">{name}</h4>
                    <p className="text-slate-300 italic mb-6 border-l-4 border-red-500 pl-4 bg-red-950/20 py-2 rounded-r">
                        {description}
                    </p>

                    {images.length > 0 && (
                        <div className="space-y-4">
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-700 group">
                                <img
                                    src={`/${images[currentSlide]}`}
                                    alt={`Snake ${currentSlide + 1}`}
                                    className="w-full h-full object-contain"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ❮
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ❯
                                        </button>
                                    </>
                                )}
                            </div>

                            {thumbnails.length > 0 && (
                                <div className="flex gap-2 justify-center overflow-x-auto py-2">
                                    {thumbnails.map((thumb, index) => (
                                        <img
                                            key={index}
                                            src={`/${thumb}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`w-16 h-12 object-cover rounded cursor-pointer border-2 transition hover:scale-105 ${index === currentSlide ? 'border-red-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                            onClick={() => goToSlide(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnakeInfoModal;
