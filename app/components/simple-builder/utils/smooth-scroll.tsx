"use client";

import { useEffect } from "react";

export function SmoothScrollHandler() {
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (!link) return;
      
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        
        // Update URL without triggering navigation
        window.history.pushState(null, "", href);
      }
    };
    
    // Add event listener to the document
    document.addEventListener("click", handleSmoothScroll);
    
    // Handle initial hash on page load
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
    
    return () => {
      document.removeEventListener("click", handleSmoothScroll);
    };
  }, []);
  
  return null;
}