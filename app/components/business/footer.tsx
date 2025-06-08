import { cn } from "@/app/lib/utils";
import { Separator } from "@/app/components/ui/separator";
import Logo from "@/app/components/ui/logo";

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
                    <div className="flex items-center justify-center gap-1 mt-2 text-muted-foreground/50 text-sm">
                        <span>Created with</span>
                        <Logo width={14} height={14} textClassName="text-xs" />
                    </div>
                </div>
            </div>
        </footer>
    );
}