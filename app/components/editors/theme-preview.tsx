"use client";

import { ThemeSchema } from "@/types/theme";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Star, MapPin, Clock, Phone, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemePreviewProps {
  theme: Partial<ThemeSchema>;
  isDarkMode?: boolean;
  className?: string;
}

export function ThemePreview({ theme, isDarkMode = false, className }: ThemePreviewProps) {
  const colors = isDarkMode && theme.colors?.dark ? theme.colors.dark : theme.colors?.light || {};
  
  // Generate inline styles based on theme
  const themeStyles = {
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground,
    '--secondary': colors.secondary,
    '--secondary-foreground': colors.secondaryForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--card': colors.card,
    '--card-foreground': colors.cardForeground,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--border': colors.border,
    '--input': colors.input,
    '--ring': colors.ring,
    'fontFamily': theme.typography?.fontFamilyBase,
  } as React.CSSProperties;

  return (
    <div 
      className={cn("min-h-[600px] overflow-auto rounded-lg border bg-background p-6", className)}
      style={themeStyles}
    >
      {/* Hero Section Preview */}
      <section className="mb-8 rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold" style={{ fontFamily: theme.typography?.fontFamilyHeading }}>
            Welcome to Our Business
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Experience excellence with our premium services. We're dedicated to providing you with the best solutions.
          </p>
          <div className="flex gap-4">
            <Button size="lg" variant="secondary">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Example */}
        <Card>
          <CardHeader>
            <CardTitle>Our Services</CardTitle>
            <CardDescription>Choose from our wide range of offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Premium Package</span>
                <Badge>Popular</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard Package</span>
                <Badge variant="secondary">Best Value</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Basic Package</span>
                <Badge variant="outline">Starter</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View All Services</Button>
          </CardFooter>
        </Card>

        {/* Contact Form Example */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>We'd love to hear from you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="Tell us how we can help..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default" className="w-full">Send Message</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Business Info Section */}
      <div className="mt-8 rounded-lg bg-muted p-6">
        <h2 className="mb-4 text-2xl font-semibold" style={{ fontFamily: theme.typography?.fontFamilyHeading }}>
          Visit Our Location
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">123 Business St, City, State 12345</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">(555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Hours</p>
              <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Button Variants */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Button Styles</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      {/* Typography Examples */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">Typography</h3>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold" style={{ fontFamily: theme.typography?.fontFamilyHeading }}>
            Heading 1
          </h1>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.typography?.fontFamilyHeading }}>
            Heading 2
          </h2>
          <h3 className="text-2xl font-medium" style={{ fontFamily: theme.typography?.fontFamilyHeading }}>
            Heading 3
          </h3>
          <p className="text-base">
            Regular paragraph text with <a href="#" className="text-primary underline-offset-4 hover:underline">a link</a> and <strong>bold text</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Small muted text for descriptions and secondary content.
          </p>
        </div>
      </div>
    </div>
  );
}