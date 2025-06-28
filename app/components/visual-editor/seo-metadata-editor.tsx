"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Globe,
  Share2,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  author?: string;
  structuredData?: Record<string, unknown>;
}

interface SEOMetadataEditorProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: SEOMetadata;
  onSave: (metadata: SEOMetadata) => void;
  businessData?: {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    category?: string;
  };
}

export default function SEOMetadataEditor({
  isOpen,
  onClose,
  metadata,
  onSave,
  businessData,
}: SEOMetadataEditorProps) {
  const [localMetadata, setLocalMetadata] = useState<SEOMetadata>(metadata);
  const [seoScore, setSeoScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Calculate SEO score and provide suggestions
  useEffect(() => {
    const calculateSEOScore = () => {
      let score = 0;
      const newIssues: string[] = [];
      const newSuggestions: string[] = [];

      // Title checks
      if (localMetadata.title) {
        score += 10;
        if (localMetadata.title.length >= 30 && localMetadata.title.length <= 60) {
          score += 10;
        } else {
          newIssues.push("Title should be between 30-60 characters");
        }
      } else {
        newIssues.push("Missing page title");
      }

      // Description checks
      if (localMetadata.description) {
        score += 10;
        if (localMetadata.description.length >= 120 && localMetadata.description.length <= 160) {
          score += 10;
        } else {
          newIssues.push("Description should be between 120-160 characters");
        }
      } else {
        newIssues.push("Missing meta description");
      }

      // Keywords
      if (localMetadata.keywords && localMetadata.keywords.length > 0) {
        score += 10;
        if (localMetadata.keywords.length >= 3 && localMetadata.keywords.length <= 10) {
          score += 5;
        } else {
          newSuggestions.push("Aim for 3-10 relevant keywords");
        }
      } else {
        newIssues.push("No keywords specified");
      }

      // Open Graph
      if (localMetadata.ogTitle) score += 10;
      else newSuggestions.push("Add Open Graph title for better social sharing");
      
      if (localMetadata.ogDescription) score += 10;
      else newSuggestions.push("Add Open Graph description for social media");
      
      if (localMetadata.ogImage) score += 10;
      else newIssues.push("Missing Open Graph image for social sharing");

      // Twitter Card
      if (localMetadata.twitterCard) score += 5;
      if (localMetadata.twitterTitle || localMetadata.ogTitle) score += 5;
      if (localMetadata.twitterDescription || localMetadata.ogDescription) score += 5;

      // Structured Data
      if (localMetadata.structuredData && Object.keys(localMetadata.structuredData).length > 0) {
        score += 10;
      } else {
        newSuggestions.push("Add structured data for rich snippets");
      }

      setSeoScore(Math.min(score, 100));
      setIssues(newIssues);
      setSuggestions(newSuggestions);
    };

    calculateSEOScore();
  }, [localMetadata]);

  const handleSave = () => {
    onSave(localMetadata);
    onClose();
  };

  const generateStructuredData = () => {
    if (!businessData) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: businessData.name,
      description: businessData.description || localMetadata.description,
      address: businessData.address ? {
        "@type": "PostalAddress",
        streetAddress: businessData.address,
      } : undefined,
      telephone: businessData.phone,
      email: businessData.email,
      url: businessData.website,
    };

    setLocalMetadata({
      ...localMetadata,
      structuredData,
    });
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !localMetadata.keywords.includes(keyword)) {
      setLocalMetadata({
        ...localMetadata,
        keywords: [...localMetadata.keywords, keyword],
      });
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setLocalMetadata({
      ...localMetadata,
      keywords: localMetadata.keywords.filter((k) => k !== keyword),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>SEO & Metadata Settings</DialogTitle>
          <DialogDescription>
            Optimize your page for search engines and social media sharing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* SEO Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Progress value={seoScore} className="flex-1" />
                  <span className={cn(
                    "text-sm font-medium",
                    seoScore >= 80 ? "text-green-600" :
                    seoScore >= 60 ? "text-yellow-600" :
                    "text-red-600"
                  )}>
                    {seoScore}%
                  </span>
                </div>
                
                {issues.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600">Issues to fix:</p>
                    {issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-yellow-600">Suggestions:</p>
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Info className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="structured">Structured Data</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={localMetadata.title}
                    onChange={(e) => setLocalMetadata({ ...localMetadata, title: e.target.value })}
                    placeholder="Enter page title (30-60 characters)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {localMetadata.title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Meta Description</Label>
                  <Textarea
                    id="description"
                    value={localMetadata.description}
                    onChange={(e) => setLocalMetadata({ ...localMetadata, description: e.target.value })}
                    placeholder="Enter meta description (120-160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {localMetadata.description.length}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleKeywordAdd((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add keyword"]') as HTMLInputElement;
                        if (input) {
                          handleKeywordAdd(input.value);
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {localMetadata.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical">Canonical URL</Label>
                  <Input
                    id="canonical"
                    value={localMetadata.canonicalUrl || ""}
                    onChange={(e) => setLocalMetadata({ ...localMetadata, canonicalUrl: e.target.value })}
                    placeholder="https://example.com/page"
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Open Graph (Facebook, LinkedIn)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">OG Title</Label>
                      <Input
                        id="ogTitle"
                        value={localMetadata.ogTitle || ""}
                        onChange={(e) => setLocalMetadata({ ...localMetadata, ogTitle: e.target.value })}
                        placeholder="Title for social sharing"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogDescription">OG Description</Label>
                      <Textarea
                        id="ogDescription"
                        value={localMetadata.ogDescription || ""}
                        onChange={(e) => setLocalMetadata({ ...localMetadata, ogDescription: e.target.value })}
                        placeholder="Description for social sharing"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        value={localMetadata.ogImage || ""}
                        onChange={(e) => setLocalMetadata({ ...localMetadata, ogImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200x630px
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogType">OG Type</Label>
                      <Select
                        value={localMetadata.ogType || "website"}
                        onValueChange={(value) => setLocalMetadata({ ...localMetadata, ogType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="business.business">Business</SelectItem>
                          <SelectItem value="restaurant.restaurant">Restaurant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Twitter Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitterCard">Card Type</Label>
                      <Select
                        value={localMetadata.twitterCard || "summary"}
                        onValueChange={(value) => setLocalMetadata({ ...localMetadata, twitterCard: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitterTitle">Twitter Title</Label>
                      <Input
                        id="twitterTitle"
                        value={localMetadata.twitterTitle || ""}
                        onChange={(e) => setLocalMetadata({ ...localMetadata, twitterTitle: e.target.value })}
                        placeholder="Title for Twitter (defaults to OG Title)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitterDescription">Twitter Description</Label>
                      <Textarea
                        id="twitterDescription"
                        value={localMetadata.twitterDescription || ""}
                        onChange={(e) => setLocalMetadata({ ...localMetadata, twitterDescription: e.target.value })}
                        placeholder="Description for Twitter (defaults to OG Description)"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="robots">Robots Meta Tag</Label>
                  <Select
                    value={localMetadata.robots || "index,follow"}
                    onValueChange={(value) => setLocalMetadata({ ...localMetadata, robots: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index,follow">Index, Follow (Default)</SelectItem>
                      <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                      <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                      <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={localMetadata.author || ""}
                    onChange={(e) => setLocalMetadata({ ...localMetadata, author: e.target.value })}
                    placeholder="Page author"
                  />
                </div>
              </TabsContent>

              <TabsContent value="structured" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Structured Data (JSON-LD)</CardTitle>
                    <CardDescription>
                      Help search engines understand your content better
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {businessData && (
                      <Button
                        variant="outline"
                        onClick={generateStructuredData}
                        className="w-full"
                      >
                        Generate from Business Data
                      </Button>
                    )}
                    
                    <Textarea
                      value={JSON.stringify(localMetadata.structuredData || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setLocalMetadata({ ...localMetadata, structuredData: parsed });
                        } catch {
                          // Invalid JSON, don't update
                        }
                      }}
                      placeholder='{"@context": "https://schema.org", "@type": "LocalBusiness", ...}'
                      rows={10}
                      className="font-mono text-xs"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save SEO Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}