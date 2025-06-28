"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/app/components/ui/hover-card";
import { cn } from "@/app/lib/utils";
import { useEventTracking } from "@/hooks/use-analytics";
import { Id } from "@/convex/_generated/dataModel";

interface BusinessContactWithAnalyticsProps {
    businessId: Id<"businesses">;
    domainId?: Id<"domains">;
    title?: string;
    subtitle?: string;
    phone?: string;
    email?: string;
    address?: string;
    className?: string;
}

export default function BusinessContactWithAnalytics({ 
    businessId,
    domainId,
    title, 
    subtitle, 
    phone, 
    email, 
    address, 
    className 
}: BusinessContactWithAnalyticsProps) {
    const { trackContact, trackClick } = useEventTracking(businessId, domainId);

    const handlePhoneClick = () => {
        trackContact("phone", { phone });
        trackClick("contact_phone", { phone });
    };

    const handleEmailClick = () => {
        trackContact("email", { email });
        trackClick("contact_email", { email });
    };

    const handleAddressClick = () => {
        trackClick("contact_address", { address });
    };

    return (
        <section className={cn("bg-muted py-12", className)}>
            <div className="mx-auto px-4 container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 font-bold text-3xl">{title || "Contact Us"}</h2>
                    {subtitle && <p className="mb-8 text-muted-foreground text-lg">{subtitle}</p>}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-medium text-lg text-center">
                                Have questions or want to get in touch? Use the contact information below or fill out our contact form.
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex md:flex-row flex-col md:justify-center gap-8">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="text-center cursor-pointer">
                                            <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-full w-12 h-12">
                                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium">Phone</h3>
                                            {phone ? (
                                                <a 
                                                    href={`tel:${phone}`} 
                                                    className="text-primary hover:underline"
                                                    onClick={handlePhoneClick}
                                                >
                                                    {phone}
                                                </a>
                                            ) : (
                                                <p className="text-muted-foreground">Not available</p>
                                            )}
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-sm">Call us</h4>
                                            <p className="text-sm">Our team is available Monday-Friday, 9am-5pm</p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="text-center cursor-pointer">
                                            <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-full w-12 h-12">
                                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium">Email</h3>
                                            {email ? (
                                                <a 
                                                    href={`mailto:${email}`} 
                                                    className="text-primary hover:underline"
                                                    onClick={handleEmailClick}
                                                >
                                                    {email}
                                                </a>
                                            ) : (
                                                <p className="text-muted-foreground">Use contact form</p>
                                            )}
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-sm">Email us</h4>
                                            <p className="text-sm">We typically respond within 24 hours</p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="text-center cursor-pointer" onClick={handleAddressClick}>
                                            <div className="flex justify-center items-center bg-primary/10 mx-auto mb-3 rounded-full w-12 h-12">
                                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium">Location</h3>
                                            {address ? (
                                                <p className="text-primary text-sm">
                                                    {address}
                                                </p>
                                            ) : (
                                                <p className="text-muted-foreground">Visit our business</p>
                                            )}
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-sm">Visit us</h4>
                                            <p className="text-sm">See our hours and directions on the map</p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}