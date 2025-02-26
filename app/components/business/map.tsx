interface BusinessMapProps {
    address?: string;
}

export default function BusinessMap({ address }: BusinessMapProps) {
    if (!address) {
        return null;
    }

    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-6">Our Location</h2>
                <div className="rounded-lg overflow-hidden shadow-md h-80">
                    <div className="relative h-full w-full">
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
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                <p className="text-gray-600">
                                    Please add a Google Maps API key to display the map.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center mt-4 text-gray-700">
                    <p>{address}</p>
                </div>
            </div>
        </div>
    );
}