import Image from "next/image";

interface BusinessHeroProps {
    title?: string;
    subtitle?: string;
    image?: string;
}

export default function BusinessHero({ title, subtitle, image }: BusinessHeroProps) {
    return (
        <div className="relative bg-gray-800 text-white">
            {image && (
                <div className="absolute inset-0 opacity-60 w-full h-full">
                    <Image height={800} width={2500} src={image} alt={title ?? ''} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="relative mx-auto px-4 py-24 text-center container">
                {title && <h1 className="mb-4 font-bold text-4xl md:text-5xl">{title}</h1>}
                {subtitle && <p className="mx-auto max-w-2xl text-xl md:text-2xl">{subtitle}</p>}
            </div>
        </div>
    );
}