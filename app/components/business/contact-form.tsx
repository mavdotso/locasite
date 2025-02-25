'use client';

import { useState } from 'react';

interface BusinessContactFormProps {
    title?: string;
}

export default function BusinessContactForm({ title }: BusinessContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        // Simulate form submission
        try {
            // TODO: send the form data to your API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFormStatus('success');
            // Reset form after success
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
            setTimeout(() => setFormStatus('idle'), 3000);
        } catch {
            setFormStatus('error');
            setTimeout(() => setFormStatus('idle'), 3000);
        }
    };

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">{title || "Contact Us"}</h2>

                    {formStatus === 'success' && (
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                            Thank you for your message! We&apos;ll get back to you soon.
                        </div>
                    )}

                    {formStatus === 'error' && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                            There was an error submitting your form. Please try again.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number (optional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            ></textarea>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={formStatus === 'submitting'}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}