import Image from "next/image";
import { cn } from "@/app/lib/utils";

interface BusinessHeroProps {
    title?: string;
    subtitle?: string;
    image?: string;
    className?: string;
}

export default function BusinessHero({ title, subtitle, image, className }: BusinessHeroProps) {
    return (
        <div className={cn("relative bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden", className)}>
            {image && (
                <div className="absolute inset-0 w-full h-full">
                    <Image 
                        height={800} 
                        width={2500} 
                        src={image} 
                        alt={title ?? ''} 
                        className="opacity-60 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                </div>
            )}
            <div className="z-10 relative mx-auto px-4 py-32 text-center container">
                {title && (
                    <h1 className="drop-shadow-md mb-6 font-bold text-4xl md:text-6xl tracking-tight">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p className="mx-auto max-w-2xl text-gray-100 text-xl md:text-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}