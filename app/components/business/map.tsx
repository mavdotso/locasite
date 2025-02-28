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
            <div className="mx-auto px-4 container">
                <h2 className="mb-6 font-bold text-2xl text-center">Our Location</h2>
                <div className="shadow-md rounded-lg h-80 overflow-hidden">
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
            </div>
        </div>
    );
}