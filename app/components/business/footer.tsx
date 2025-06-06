import { cn } from "@/app/lib/utils";
import { Separator } from "@/app/components/ui/separator";

interface BusinessFooterProps {
    businessName: string;
    className?: string;
}

export default function BusinessFooter({ businessName, className }: BusinessFooterProps) {
    return (
        <footer className={cn("bg-muted py-8", className)}>
            <div className="mx-auto px-4 container">
                <Separator className="mb-6" />
                <div className="text-center">
                    <p className="text-muted-foreground">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
                    <p className="mt-2 text-muted-foreground/50 text-sm">Created with Business Site Generator</p>
                </div>
            </div>
        </footer>
    );
}