import Image from "next/image";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

interface BusinessGalleryProps {
    images?: string[];
    className?: string;
}

export default function BusinessGallery({ images, className }: BusinessGalleryProps) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <section className={cn("bg-muted py-12", className)}>
            <div className="mx-auto px-4 container">
                <h2 className="mb-8 font-bold text-3xl text-center">Photo Gallery</h2>
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {images.map((image, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="aspect-square overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        height={500}
                                        width={500}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}