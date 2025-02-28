interface BusinessContactProps {
    title?: string;
    subtitle?: string;
}

export default function BusinessContact({ title, subtitle }: BusinessContactProps) {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto px-4 container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 font-bold text-3xl">{title || "Contact Us"}</h2>
                    {subtitle && <p className="mb-8 text-gray-600 text-lg">{subtitle}</p>}
                    <div className="bg-white shadow-md p-8 rounded-lg">
                        <p className="mb-6 text-center">
                            Have questions or want to get in touch? Use the contact information below or fill out our contact form.
                        </p>
                        <div className="flex md:flex-row flex-col md:justify-center gap-8">
                            <div className="text-center">
                                <div className="flex justify-center items-center bg-blue-100 mx-auto mb-3 rounded-full w-12 h-12">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium">Phone</h3>
                                <p className="text-gray-600">Call us for information</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center items-center bg-blue-100 mx-auto mb-3 rounded-full w-12 h-12">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-gray-600">Send us your questions</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center items-center bg-blue-100 mx-auto mb-3 rounded-full w-12 h-12">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium">Location</h3>
                                <p className="text-gray-600">Visit our business</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}