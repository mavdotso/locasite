"use client";

import { BusinessData } from '@/convex/businesses';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { MapPin, Phone, Globe, Clock, Star } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
interface BusinessPreviewCardProps {
    businessData: BusinessData;
}

export default function BusinessPreviewCard({ businessData }: BusinessPreviewCardProps) {
    const { signIn } = useAuthActions();
    const user = useQuery(api.auth.currentUser);

    const handlePublish = async () => {
        // Store business data in sessionStorage
        sessionStorage.setItem('pendingBusinessData', JSON.stringify({
            businessData,
            aiContent: null // No AI content in initial flow
        }));
        
        if (!user) {
            // Redirect to sign-in
            signIn("google");
        } else {
            // User is already logged in, go directly to dashboard
            // The AuthHandler will pick it up from there
            window.location.href = '/dashboard';
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                {businessData.photos?.[0] && (
                    <div className="relative h-48 bg-muted">
                        <img 
                            src={businessData.photos[0]} 
                            alt={businessData.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                            {businessData.name}
                        </h2>
                    </div>
                )}
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                    {businessData.address && (
                        <div className="flex items-start gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span>{businessData.address}</span>
                        </div>
                    )}
                    
                    {businessData.phone && (
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{businessData.phone}</span>
                        </div>
                    )}
                    
                    {businessData.website && (
                        <div className="flex items-center gap-3 text-sm">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <a 
                                href={businessData.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {businessData.website}
                            </a>
                        </div>
                    )}
                    
                    {businessData.rating && (
                        <div className="flex items-center gap-3 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{businessData.rating} / 5.0</span>
                        </div>
                    )}
                </div>

                {businessData.description && (
                    <p className="text-sm text-muted-foreground">
                        {businessData.description}
                    </p>
                )}

                {businessData.hours && businessData.hours.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Business Hours</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1 pl-6">
                            {businessData.hours.slice(0, 3).map((hour, idx) => (
                                <div key={idx}>{hour}</div>
                            ))}
                            {businessData.hours.length > 3 && (
                                <div className="text-xs">...and {businessData.hours.length - 3} more</div>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <Button 
                        onClick={handlePublish}
                        className="flex-1"
                    >
                        {user ? 'Continue to Dashboard' : 'Sign in to Continue'}
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Start Over
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}