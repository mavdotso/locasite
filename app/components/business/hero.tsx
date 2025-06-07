"use client";

import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { InlineEditor } from "@/components/editors/inline-editor";
import { SectionWrapper } from "@/components/editors/section-wrapper";
import { SectionEditor } from "@/components/editors/section-editor";
import { useContext, useState } from "react";
import { EditModeContext } from "@/components/providers/edit-mode-provider";

interface SectionData {
    [key: string]: unknown;
}

interface BusinessHeroProps {
    title?: string;
    subtitle?: string;
    image?: string;
    className?: string;
    'data-editable'?: string;
    'data-editable-subtitle'?: string;
}

export default function BusinessHero({ title, subtitle, image, className, ...props }: BusinessHeroProps) {
    const editMode = useContext(EditModeContext);
    const { isEditMode, draftData, updateDraft } = editMode || {};
    const [showEditor, setShowEditor] = useState(false);
    const [sectionData, setSectionData] = useState<SectionData>({
        title,
        subtitle,
        image,
        typography: {},
        background: {}
    });
    
    // Use draft data if in edit mode
    const displayTitle = isEditMode && draftData?.name ? draftData.name : title;
    const displaySubtitle = isEditMode && draftData?.description ? draftData.description : subtitle;

    const handleSectionSave = (data: SectionData) => {
        setSectionData(data);
        // Update the business data through the edit context
        if (data.title !== title) {
            updateDraft?.("name", data.title as string);
        }
        if (data.subtitle !== subtitle) {
            updateDraft?.("description", data.subtitle as string);
        }
    };
    
    const background = sectionData.background as { type?: string; color?: string; image?: string; size?: string; position?: string; repeat?: string; overlay?: { color: string; opacity: number } } | undefined;
    const typography = sectionData.typography as { 
        fontSize?: number; 
        fontFamily?: string; 
        fontWeight?: string; 
        lineHeight?: number; 
        letterSpacing?: number; 
        textAlign?: string; 
        color?: string; 
        textTransform?: string; 
    } | undefined;

    const heroStyle = {
        ...(background?.type === "color" && {
            backgroundColor: background.color
        }),
        ...(background?.type === "image" && {
            backgroundImage: `url(${background.image})`,
            backgroundSize: background.size || "cover",
            backgroundPosition: background.position || "center",
            backgroundRepeat: background.repeat || "no-repeat"
        }),
        ...(typography?.fontSize && {
            fontSize: `${typography.fontSize}px`
        })
    };

    return (
        <>
            <SectionWrapper
                sectionType="hero"
                sectionId="hero-1"
                onEdit={() => setShowEditor(true)}
                className={className}
            >
                <div 
                    className={cn("relative bg-gradient-to-r from-foreground to-foreground/90 text-white overflow-hidden")}
                    style={heroStyle}
                >
                    {(image || background?.image) && (
                        <div className="absolute inset-0 w-full h-full">
                            <Image 
                                height={800} 
                                width={2500} 
                                src={background?.image || image || ""} 
                                alt={title ?? ''} 
                                className="opacity-60 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"></div>
                            {background?.overlay && (
                                <div 
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor: background.overlay.color,
                                        opacity: background.overlay.opacity / 100
                                    }}
                                />
                            )}
                        </div>
                    )}
                    <div className="z-10 relative mx-auto px-4 py-32 text-center container">
                        {(title || isEditMode) && (
                            <h1 
                                className="drop-shadow-md mb-6 font-bold text-4xl md:text-6xl tracking-tight"
                                style={{
                                    fontFamily: typography?.fontFamily,
                                    fontSize: typography?.fontSize ? `${typography.fontSize}px` : undefined,
                                    fontWeight: typography?.fontWeight,
                                    lineHeight: typography?.lineHeight,
                                    letterSpacing: typography?.letterSpacing ? `${typography.letterSpacing}px` : undefined,
                                    textAlign: typography?.textAlign as React.CSSProperties['textAlign'],
                                    color: typography?.color,
                                    textTransform: typography?.textTransform as React.CSSProperties['textTransform']
                                }}
                            >
                                {isEditMode ? (
                                    <InlineEditor
                                        value={displayTitle || ""}
                                        onChange={(value) => updateDraft?.("name", value)}
                                        placeholder="Business Name"
                                        className="text-white"
                                        tag="span"
                                        data-editable={props['data-editable']}
                                    />
                                ) : (
                                    <span data-editable={props['data-editable']}>
                                        {(sectionData.title as string) || title}
                                    </span>
                                )}
                            </h1>
                        )}
                        {(subtitle || isEditMode) && (
                            <p 
                                className="mx-auto max-w-2xl text-white/90 text-xl md:text-2xl leading-relaxed"
                                style={{
                                    fontFamily: typography?.fontFamily,
                                    textAlign: typography?.textAlign as React.CSSProperties['textAlign'],
                                    color: typography?.color
                                }}
                            >
                                {isEditMode ? (
                                    <InlineEditor
                                        value={displaySubtitle || ""}
                                        onChange={(value) => updateDraft?.("description", value)}
                                        placeholder="Business Description"
                                        className="text-white/90 block w-full text-center"
                                        multiline
                                        data-editable={props['data-editable-subtitle']}
                                    />
                                ) : (
                                    <span data-editable={props['data-editable-subtitle']}>
                                        {(sectionData.subtitle as string) || subtitle}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </SectionWrapper>

            <SectionEditor
                isOpen={showEditor}
                onClose={() => setShowEditor(false)}
                sectionType="hero"
                sectionData={sectionData}
                onSave={handleSectionSave}
            />
        </>
    );
}