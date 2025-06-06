"use client";

import Image from "next/image";
import { Card, CardContent } from "@/app/components/ui/card";
import { SectionWrapper } from "@/components/editors/section-wrapper";
import { SectionEditor } from "@/components/editors/section-editor";
import { useContext, useState } from "react";
import { EditModeContext } from "@/components/providers/edit-mode-provider";
import { cn } from "@/app/lib/utils";

interface BusinessGalleryProps {
    images?: string[];
    className?: string;
}

export default function BusinessGallery({ images, className }: BusinessGalleryProps) {
    const editMode = useContext(EditModeContext);
    const { isEditMode } = editMode || {};
    const [showEditor, setShowEditor] = useState(false);
    const [sectionData, setSectionData] = useState({
        images: images || [],
        title: "Photo Gallery",
        layout: "grid",
        columns: 4,
        spacing: "normal",
        typography: {},
        background: {}
    });

    const handleSectionSave = (data: any) => {
        setSectionData(data);
    };

    const displayImages = sectionData.images.length > 0 ? sectionData.images : images;

    if (!displayImages || (displayImages.length === 0 && !isEditMode)) {
        return null;
    }

    const galleryStyle = {
        ...(sectionData.background?.type === "color" && {
            backgroundColor: sectionData.background.color
        }),
        ...(sectionData.background?.type === "image" && {
            backgroundImage: `url(${sectionData.background.image})`,
            backgroundSize: sectionData.background.size || "cover",
            backgroundPosition: sectionData.background.position || "center",
            backgroundRepeat: sectionData.background.repeat || "no-repeat"
        })
    };

    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    }[sectionData.columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

    const gapSize = {
        none: "gap-0",
        small: "gap-2",
        normal: "gap-4",
        large: "gap-6",
        xl: "gap-8"
    }[sectionData.spacing] || "gap-4";

    return (
        <>
            <SectionWrapper
                sectionType="gallery"
                sectionId="gallery-1"
                onEdit={() => setShowEditor(true)}
                className={className}
            >
                <section 
                    className={cn("bg-muted py-12")}
                    style={galleryStyle}
                >
                    <div className="mx-auto px-4 container">
                        <h2 
                            className="mb-8 font-bold text-3xl text-center"
                            style={{
                                fontFamily: sectionData.typography?.fontFamily,
                                fontSize: sectionData.typography?.fontSize ? `${sectionData.typography.fontSize}px` : undefined,
                                fontWeight: sectionData.typography?.fontWeight,
                                textAlign: sectionData.typography?.textAlign as any,
                                color: sectionData.typography?.color,
                                textTransform: sectionData.typography?.textTransform as any
                            }}
                        >
                            {sectionData.title}
                        </h2>
                        
                        {displayImages && displayImages.length > 0 ? (
                            <div className={cn("grid", gridCols, gapSize)}>
                                {displayImages.map((image, index) => (
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
                        ) : isEditMode ? (
                            <div className="text-center py-8 border-2 border-dashed border-muted-foreground/50 rounded-lg">
                                <p className="text-muted-foreground">Click edit to add gallery images</p>
                            </div>
                        ) : null}
                    </div>
                </section>
            </SectionWrapper>

            <SectionEditor
                isOpen={showEditor}
                onClose={() => setShowEditor(false)}
                sectionType="gallery"
                sectionData={sectionData}
                onSave={handleSectionSave}
            />
        </>
    );
}