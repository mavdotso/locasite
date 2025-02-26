import DOMPurify from 'dompurify';

interface BusinessAboutProps {
    content?: string;
}

export default function BusinessAbout({ content }: BusinessAboutProps) {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
                    <div className="prose prose-lg mx-auto">
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