import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';

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
        <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 py-4 container">
                <div className="flex md:flex-row flex-col md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h1 className="font-bold text-xl">{businessName}</h1>
                    </div>
                    <nav>
                        <ul className="flex flex-wrap gap-4">
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
                                        <Link
                                            href={`/${page.slug}`}
                                            className={`px-3 py-2 rounded hover:bg-gray-100 ${currentSlug === page.slug ? 'font-bold text-blue-600' : ''
                                                }`}
                                        >
                                            {title}
                                        </Link>
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