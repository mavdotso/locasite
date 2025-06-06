'use client';

import { useEffect } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BusinessData } from '@/convex/businesses';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export function AuthHandler() {
    const createBusiness = useMutation(api.businesses.createFromPreview);
    const user = useQuery(api.auth.currentUser);
    const router = useRouter();
    
    useEffect(() => {
        const handlePendingBusiness = async () => {
            // Only proceed if user is authenticated
            if (!user) return;
            
            const pendingBusinessData = sessionStorage.getItem('pendingBusiness');
            
            if (pendingBusinessData) {
                try {
                    const businessData: BusinessData = JSON.parse(pendingBusinessData);
                    
                    // Create the business
                    const businessId = await createBusiness({ businessData });
                    
                    // Clear the pending data
                    sessionStorage.removeItem('pendingBusiness');
                    
                    // Show success message
                    toast.success("Website published!", {
                        description: `Your ${businessData.name} website has been created successfully.`,
                    });
                    
                    // Redirect to the business management page or dashboard
                    // For now, we'll redirect to the main page
                    router.push('/');
                    
                } catch (error) {
                    console.error('Error creating business from preview:', error);
                    toast.error("Error publishing website", {
                        description: "There was an error creating your website. Please try again.",
                    });
                }
            }
        };

        handlePendingBusiness();
    }, [user, createBusiness, router]);

    return null; // This component doesn't render anything
}