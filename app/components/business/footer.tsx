interface BusinessFooterProps {
    businessName: string;
}

export default function BusinessFooter({ businessName }: BusinessFooterProps) {
    return (
        <footer className="bg-gray-100 py-8">
            <div className="mx-auto px-4 container">
                <div className="text-center">
                    <p className="text-gray-600">© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
                    <p className="mt-2 text-gray-500 text-sm">Created with Business Site Generator</p>
                </div>
            </div>
        </footer>
    );
}