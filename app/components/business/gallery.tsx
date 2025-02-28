import Image from "next/image";

interface BusinessGalleryProps {
    images?: string[];
}

export default function BusinessGallery({ images }: BusinessGalleryProps) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto px-4 container">
                <h2 className="mb-8 font-bold text-3xl text-center">Photo Gallery</h2>
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {images.map((image, index) => (
                        <div key={index} className="bg-white shadow rounded aspect-square overflow-hidden">
                            <Image
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                height={500}
                                width={500}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}