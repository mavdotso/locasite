import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

interface BusinessMapProps {
    address?: string;
    className?: string;
}

export default function BusinessMap({ address, className }: BusinessMapProps) {
    if (!address) {
        return null;
    }

    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;

    return (
        <section className={cn("py-8", className)}>
            <div className="mx-auto px-4 container">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-center">Our Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md h-80 overflow-hidden">
                            <div className="relative w-full h-full">
                                <iframe
                                    title="Business Location Map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src={mapUrl}
                                    allowFullScreen
                                ></iframe>
                                {!process.env.GOOGLE_MAPS_API_KEY && (
                                    <div className="absolute inset-0 flex justify-center items-center bg-gray-200">
                                        <p className="text-gray-600">
                                            Please add a Google Maps API key to display the map.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 text-gray-700 text-center">
                            <p>{address}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}