import DOMPurify from 'dompurify';

interface BusinessAboutProps {
    content?: string;
}

export default function BusinessAbout({ content }: BusinessAboutProps) {
    return (
        <div className="bg-white py-12">
            <div className="mx-auto px-4 container">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-8 font-bold text-3xl text-center">About Us</h2>
                    <div className="mx-auto prose prose-lg">
                        {content ? (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
                        ) : (
                            <p className="text-gray-500 italic">No information available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}