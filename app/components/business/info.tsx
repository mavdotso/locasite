interface BusinessInfoProps {
    address?: string;
    phone?: string;
    website?: string;
    hours?: string[];
}

export default function BusinessInfo({ address, phone, website, hours }: BusinessInfoProps) {
    return (
        <div className="bg-white py-8">
            <div className="mx-auto px-4 container">
                <div className="bg-white shadow mx-auto p-6 rounded-lg max-w-xl">
                    <h2 className="mb-4 font-semibold text-2xl">Business Information</h2>
                    <div className="space-y-4">
                        {address && (
                            <div>
                                <h3 className="font-semibold">Address:</h3>
                                <p>{address}</p>
                            </div>
                        )}

                        {phone && (
                            <div>
                                <h3 className="font-semibold">Phone:</h3>
                                <p><a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a></p>
                            </div>
                        )}

                        {website && (
                            <div>
                                <h3 className="font-semibold">Website:</h3>
                                <p><a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{website}</a></p>
                            </div>
                        )}

                        {hours && hours.length > 0 && (
                            <div>
                                <h3 className="font-semibold">Business Hours:</h3>
                                <ul className="space-y-1">
                                    {hours.map((hour, index) => (
                                        <li key={index} className="pb-1 border-gray-100 border-b">{hour}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}