"use client";

import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { InlineEditor } from "@/components/editors/inline-editor";
import { useContext } from "react";
import { EditModeContext } from "@/components/providers/edit-mode-provider";

interface BusinessHeroProps {
    title?: string;
    subtitle?: string;
    image?: string;
    className?: string;
}

export default function BusinessHero({ title, subtitle, image, className }: BusinessHeroProps) {
    const editMode = useContext(EditModeContext);
    const { isEditMode, draftData, updateDraft } = editMode || {};
    
    // Use draft data if in edit mode
    const displayTitle = isEditMode && draftData?.name ? draftData.name : title;
    const displaySubtitle = isEditMode && draftData?.description ? draftData.description : subtitle;
    
    return (
        <div className={cn("relative bg-gradient-to-r from-foreground to-foreground/90 text-white overflow-hidden", className)}>
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
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"></div>
                </div>
            )}
            <div className="z-10 relative mx-auto px-4 py-32 text-center container">
                {(title || isEditMode) && (
                    <h1 className="drop-shadow-md mb-6 font-bold text-4xl md:text-6xl tracking-tight">
                        {isEditMode ? (
                            <InlineEditor
                                value={displayTitle || ""}
                                onChange={(value) => updateDraft?.("name", value)}
                                placeholder="Business Name"
                                className="text-white"
                                tag="span"
                            />
                        ) : (
                            title
                        )}
                    </h1>
                )}
                {(subtitle || isEditMode) && (
                    <p className="mx-auto max-w-2xl text-white/90 text-xl md:text-2xl leading-relaxed">
                        {isEditMode ? (
                            <InlineEditor
                                value={displaySubtitle || ""}
                                onChange={(value) => updateDraft?.("description", value)}
                                placeholder="Business Description"
                                className="text-white/90 block w-full text-center"
                                multiline
                            />
                        ) : (
                            subtitle
                        )}
                    </p>
                )}
            </div>
        </div>
    );
}