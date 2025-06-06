"use client";

import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { InlineEditor } from "@/components/editors/inline-editor";
import { SectionWrapper } from "@/components/editors/section-wrapper";
import { SectionEditor } from "@/components/editors/section-editor";
import { useContext, useState } from "react";
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
    const [showEditor, setShowEditor] = useState(false);
    const [sectionData, setSectionData] = useState({
        title,
        subtitle,
        image,
        typography: {},
        background: {}
    });
    
    // Use draft data if in edit mode
    const displayTitle = isEditMode && draftData?.name ? draftData.name : title;
    const displaySubtitle = isEditMode && draftData?.description ? draftData.description : subtitle;

    const handleSectionSave = (data: any) => {
        setSectionData(data);
        // Update the business data through the edit context
        if (data.title !== title) {
            updateDraft?.("name", data.title);
        }
        if (data.subtitle !== subtitle) {
            updateDraft?.("description", data.subtitle);
        }
    };
    
    const heroStyle = {
        ...(sectionData.background?.type === "color" && {
            backgroundColor: sectionData.background.color
        }),
        ...(sectionData.background?.type === "image" && {
            backgroundImage: `url(${sectionData.background.image})`,
            backgroundSize: sectionData.background.size || "cover",
            backgroundPosition: sectionData.background.position || "center",
            backgroundRepeat: sectionData.background.repeat || "no-repeat"
        }),
        ...(sectionData.typography?.fontSize && {
            fontSize: `${sectionData.typography.fontSize}px`
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
                    {(image || sectionData.background?.image) && (
                        <div className="absolute inset-0 w-full h-full">
                            <Image 
                                height={800} 
                                width={2500} 
                                src={sectionData.background?.image || image || ""} 
                                alt={title ?? ''} 
                                className="opacity-60 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"></div>
                            {sectionData.background?.overlay && (
                                <div 
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor: sectionData.background.overlay.color,
                                        opacity: sectionData.background.overlay.opacity / 100
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
                                    fontFamily: sectionData.typography?.fontFamily,
                                    fontSize: sectionData.typography?.fontSize ? `${sectionData.typography.fontSize}px` : undefined,
                                    fontWeight: sectionData.typography?.fontWeight,
                                    lineHeight: sectionData.typography?.lineHeight,
                                    letterSpacing: sectionData.typography?.letterSpacing ? `${sectionData.typography.letterSpacing}px` : undefined,
                                    textAlign: sectionData.typography?.textAlign as any,
                                    color: sectionData.typography?.color,
                                    textTransform: sectionData.typography?.textTransform as any
                                }}
                            >
                                {isEditMode ? (
                                    <InlineEditor
                                        value={displayTitle || ""}
                                        onChange={(value) => updateDraft?.("name", value)}
                                        placeholder="Business Name"
                                        className="text-white"
                                        tag="span"
                                    />
                                ) : (
                                    sectionData.title || title
                                )}
                            </h1>
                        )}
                        {(subtitle || isEditMode) && (
                            <p 
                                className="mx-auto max-w-2xl text-white/90 text-xl md:text-2xl leading-relaxed"
                                style={{
                                    fontFamily: sectionData.typography?.fontFamily,
                                    textAlign: sectionData.typography?.textAlign as any,
                                    color: sectionData.typography?.color
                                }}
                            >
                                {isEditMode ? (
                                    <InlineEditor
                                        value={displaySubtitle || ""}
                                        onChange={(value) => updateDraft?.("description", value)}
                                        placeholder="Business Description"
                                        className="text-white/90 block w-full text-center"
                                        multiline
                                    />
                                ) : (
                                    sectionData.subtitle || subtitle
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