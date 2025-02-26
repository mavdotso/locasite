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
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Photo Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="bg-white rounded shadow overflow-hidden aspect-square">
                            <Image
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                height={500}
                                width={500}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}