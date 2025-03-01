import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

interface BusinessAboutProps {
    content?: string;
    className?: string;
}

export default function BusinessAbout({ content, className }: BusinessAboutProps) {
    return (
        <section className={cn("py-16 bg-white", className)}>
            <div className="mx-auto px-4 container">
                <div className="mx-auto max-w-3xl">
                    <Card className="shadow-md border-none">
                        <CardHeader>
                            <CardTitle className="font-bold text-3xl text-center">About Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mx-auto prose prose-lg prose-slate">
                                {content ? (
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                ) : (
                                    <p className="text-gray-500 text-center italic">No information available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}