"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { Card, CardContent } from "@/app/components/ui/card";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";

interface BusinessGalleryProps {
    images?: string[];
    className?: string;
}

export default function BusinessGallery({ images, className }: BusinessGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={cn("py-16", className)}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <Card 
                            key={index} 
                            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setSelectedImage(image)}
                        >
                            <CardContent className="p-0">
                                <div className="aspect-square relative">
                                    <Image
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0">
                    {selectedImage && (
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={selectedImage}
                                alt="Gallery image"
                                fill
                                className="object-contain"
                                sizes="90vw"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Alias for compatibility
export { BusinessGallery as Gallery };