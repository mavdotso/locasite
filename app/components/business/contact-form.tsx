'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner"
import { cn } from '@/app/lib/utils';

interface BusinessContactFormProps {
    title?: string;
    className?: string;
}

export default function BusinessContactForm({ title, className }: BusinessContactFormProps) {
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
            
            toast.success("Message sent!", {
                description: "Thank you for your message. We'll get back to you soon.",
            });
            
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
            
            toast.error("Something went wrong", {
                description: "There was an error submitting your form. Please try again.",
            });
            
            setTimeout(() => setFormStatus('idle'), 3000);
        }
    };

    return (
        <section className={cn("py-16 bg-gray-50", className)}>
            <div className="mx-auto px-4 container">
                <div className="mx-auto max-w-lg">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-bold text-3xl text-center">{title || "Contact Us"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block font-medium text-gray-700 text-sm">
                                        Your Name
                                    </label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block font-medium text-gray-700 text-sm">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block font-medium text-gray-700 text-sm">
                                        Phone Number (optional)
                                    </label>
                                    <Input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="block font-medium text-gray-700 text-sm">
                                        Your Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="pt-2 text-center">
                                    <Button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="px-8 w-full sm:w-auto"
                                    >
                                        {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}