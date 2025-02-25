interface BusinessInfoProps {
    address?: string;
    phone?: string;
    website?: string;
    hours?: string[];
}

export default function BusinessInfo({ address, phone, website, hours }: BusinessInfoProps) {
    return (
        <div className="bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Business Information</h2>
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
                                        <li key={index} className="border-b border-gray-100 pb-1">{hour}</li>
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