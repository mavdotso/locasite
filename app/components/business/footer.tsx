interface BusinessFooterProps {
    businessName: string;
}

export default function BusinessFooter({ businessName }: BusinessFooterProps) {
    return (
        <footer className="bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <p className="text-gray-600">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
                    <p className="text-gray-500 text-sm mt-2">Created with Business Site Generator</p>
                </div>
            </div>
        </footer>
    );
}