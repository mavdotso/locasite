import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

interface BusinessAboutProps {
    title?: string;
    content?: string;
    className?: string;
}

export default function BusinessAbout({ title = "About Us", content, className }: BusinessAboutProps) {
    return (
        <section className={cn("py-16 bg-background", className)}>
            <div className="mx-auto px-4 container">
                <div className="mx-auto max-w-3xl">
                    <Card className="shadow-md border-none">
                        <CardHeader>
                            <CardTitle className="font-bold text-3xl text-center">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mx-auto prose prose-lg prose-slate">
                                {content ? (
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                ) : (
                                    <p className="text-muted-foreground text-center italic">No information available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}