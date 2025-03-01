import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/app/lib/utils";

interface BusinessInfoProps {
    address?: string;
    phone?: string;
    website?: string;
    hours?: string[];
    className?: string;
}

export default function BusinessInfo({ address, phone, website, hours, className }: BusinessInfoProps) {
    return (
        <section className={cn("bg-white py-8", className)}>
            <div className="mx-auto px-4 container">
                <Card className="mx-auto max-w-xl">
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {address && (
                            <div>
                                <h3 className="font-semibold">Address:</h3>
                                <p>{address}</p>
                            </div>
                        )}

                        {phone && (
                            <div>
                                <h3 className="font-semibold">Phone:</h3>
                                <p><a href={`tel:${phone}`} className="text-primary hover:underline">{phone}</a></p>
                            </div>
                        )}

                        {website && (
                            <div>
                                <h3 className="font-semibold">Website:</h3>
                                <p><a href={website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{website}</a></p>
                            </div>
                        )}

                        {hours && hours.length > 0 && (
                            <div>
                                <h3 className="font-semibold">Business Hours:</h3>
                                <ul className="space-y-1 mt-2">
                                    {hours.map((hour, index) => (
                                        <li key={index} className="pb-1">
                                            {hour}
                                            {index < hours.length - 1 && <Separator className="mt-1" />}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}