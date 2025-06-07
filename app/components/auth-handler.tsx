'use client';

import { useEffect } from 'react';
// import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export function AuthHandler() {
    const createFromPending = useMutation(api.createFromPending.createBusinessFromPendingData);
    const user = useQuery(api.auth.currentUser);
    const router = useRouter();
    
    useEffect(() => {
        const handlePendingBusiness = async () => {
            // Only proceed if user is authenticated
            if (!user) return;
            
            const pendingBusinessDataStr = sessionStorage.getItem('pendingBusinessData');
            
            if (pendingBusinessDataStr) {
                try {
                    const { businessData, aiContent } = JSON.parse(pendingBusinessDataStr);
                    
                    // Create the business
                    const { businessId } = await createFromPending({ 
                        businessData,
                        aiContent: aiContent || undefined
                    });
                    
                    // Clear the pending data
                    sessionStorage.removeItem('pendingBusinessData');
                    
                    // Show success message
                    toast.success("Website published!", {
                        description: `Your ${businessData.name} website has been created successfully.`,
                    });
                    
                    // Redirect to edit page
                    router.push(`/business/${businessId}/edit`);
                    
                } catch (error) {
                    console.error('Error creating business from preview:', error);
                    toast.error("Error publishing website", {
                        description: "There was an error creating your website. Please try again.",
                    });
                }
            }
        };

        handlePendingBusiness();
    }, [user, createFromPending, router]);

    return null; // This component doesn't render anything
}