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
        const handleAuthRedirect = async () => {
            // Only proceed if user is authenticated
            if (!user) return;
            
            // First check for auth redirect
            const authRedirect = sessionStorage.getItem('authRedirect');
            if (authRedirect) {
                sessionStorage.removeItem('authRedirect');
                router.push(authRedirect);
                return; // Exit early to avoid handling pending business
            }
            
            // Then check for pending business
            const pendingBusinessDataStr = sessionStorage.getItem('pendingBusinessData');
            
            if (pendingBusinessDataStr) {
                try {
                    const { businessData, aiContent } = JSON.parse(pendingBusinessDataStr);
                    
                    // Create the business
                    await createFromPending({ 
                        businessData,
                        aiContent: aiContent || undefined
                    });
                    
                    // Clear the pending data
                    sessionStorage.removeItem('pendingBusinessData');
                    
                    // Show success message
                    toast.success("Website created!", {
                        description: `Your ${businessData.name} website has been created as a draft.`,
                    });
                    
                    // Redirect to dashboard
                    router.push('/dashboard');
                    
                } catch (error) {
                    console.error('Error creating business from preview:', error);
                    toast.error("Error creating website", {
                        description: "There was an error creating your website. Please try again.",
                    });
                }
            }
        };

        handleAuthRedirect();
    }, [user, createFromPending, router]);

    return null; // This component doesn't render anything
}