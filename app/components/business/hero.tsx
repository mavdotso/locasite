
interface BusinessHeroProps {
    title?: string;
    subtitle?: string;
    image?: string;
}

export default function BusinessHero({ title, subtitle, image }: BusinessHeroProps) {
    return (
        <div className="relative bg-gray-800 text-white">
            {image && (
                <div className="absolute inset-0 w-full h-full opacity-60">
                    {/* Use next/image for optimized images */}
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="relative container mx-auto px-4 py-24 text-center">
                {title && <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>}
                {subtitle && <p className="text-xl md:text-2xl max-w-2xl mx-auto">{subtitle}</p>}
            </div>
        </div>
    );
}