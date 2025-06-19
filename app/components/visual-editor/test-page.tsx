"use client";

import React from "react";
import { VisualEditor } from "./index";
import { Id } from "@/convex/_generated/dataModel";

// Mock business data for testing
const mockBusiness = {
  _id: "test-business-id" as Id<"businesses">,
  _creationTime: Date.now(),
  userId: "test-user",
  name: "Test Business",
  domain: "test-business",
  description: "A test business for the visual editor",
  address: "123 Test Street, Test City, TC 12345",
  phone: "+1 (555) 123-4567",
  email: "contact@testbusiness.com",
  website: "https://testbusiness.com",
  googleMapsUrl: "https://maps.google.com/test",
  images: [],
  reviews: [
    {
      author: "John Doe",
      rating: 5,
      text: "Great service!",
      date: "2024-01-01"
    },
    {
      author: "Jane Smith",
      rating: 4,
      text: "Very professional and friendly staff.",
      date: "2024-01-15"
    }
  ],
  hours: {
    Monday: { open: "9:00 AM", close: "5:00 PM" },
    Tuesday: { open: "9:00 AM", close: "5:00 PM" },
    Wednesday: { open: "9:00 AM", close: "5:00 PM" },
    Thursday: { open: "9:00 AM", close: "5:00 PM" },
    Friday: { open: "9:00 AM", close: "5:00 PM" },
    Saturday: { open: "10:00 AM", close: "3:00 PM" },
    Sunday: { open: "Closed", close: "Closed" }
  },
  averageRating: 4.5,
  isVerified: true,
  isPaid: false,
  category: "Service"
};

export default function VisualEditorTestPage() {
  return (
    <div className="h-screen">
      <VisualEditor
        businessId={mockBusiness._id}
        business={mockBusiness}
        pageId={"test-page-id" as Id<"pages">}
        initialData={{
          title: "Welcome to Our Business",
          components: []
        }}
        onSave={async (data) => {
          console.log("Saving page data:", data);
          // In a real app, this would save to Convex
        }}
      />
    </div>
  );
}