import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from "@/app/components/ui/button";

interface BusinessHeaderProps {
    businessName: string;
    pages: Array<{
        _id: Id<"pages">;
        slug: string;
        content: string;
    }>;
    currentSlug: string;
}

export default function BusinessHeader({ businessName, pages, currentSlug }: BusinessHeaderProps) {
    return (
        <header className="top-0 z-50 sticky bg-white shadow-sm">
            <div className="mx-auto px-4 py-4 container">
                <div className="flex md:flex-row flex-col md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h1 className="font-bold text-primary text-xl">{businessName}</h1>
                    </div>
                    <nav>
                        <ul className="flex flex-wrap gap-2">
                            {pages.map((page) => {
                                const title = (() => {
                                    try {
                                        return JSON.parse(page.content).title || page.slug;
                                    } catch {
                                        return page.slug;
                                    }
                                })();

                                return (
                                    <li key={page._id as string}>
                                        <Button
                                            asChild
                                            variant={currentSlug === page.slug ? "default" : "ghost"}
                                            size="sm"
                                        >
                                            <Link href={`/${page.slug}`}>
                                                {title}
                                            </Link>
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}