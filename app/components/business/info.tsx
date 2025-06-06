import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import BusinessHours from "@/app/components/business/hours";

interface BusinessInfoProps {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string[];
    className?: string;
}

export default function BusinessInfo({ address, phone, email, website, hours, className }: BusinessInfoProps) {
    return (
        <section className={cn("bg-background py-8", className)}>
            <div className="mx-auto px-4 container">
                <Card className="mx-auto max-w-xl">
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {address && (
                            <div>
                                <h3 className="font-semibold">Address:</h3>
                                <p>
                                    <a 
                                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {address}
                                    </a>
                                </p>
                            </div>
                        )}

                        {phone && (
                            <div>
                                <h3 className="font-semibold">Phone:</h3>
                                <p>
                                    <a 
                                        href={`tel:${phone}`} 
                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {phone}
                                    </a>
                                </p>
                            </div>
                        )}

                        {email && (
                            <div>
                                <h3 className="font-semibold">Email:</h3>
                                <p>
                                    <a 
                                        href={`mailto:${email}`} 
                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {email}
                                    </a>
                                </p>
                            </div>
                        )}

                        {website && (
                            <div>
                                <h3 className="font-semibold">Website:</h3>
                                <p>
                                    <a 
                                        href={website} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        {website}
                                    </a>
                                </p>
                            </div>
                        )}

                        {hours && hours.length > 0 && (
                            <BusinessHours hours={hours} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}