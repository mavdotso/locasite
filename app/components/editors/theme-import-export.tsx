"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Download, Upload, Copy, Check, FileJson } from "lucide-react";
import { toast } from "sonner";

interface ThemeImportExportProps {
  businessId?: Id<"businesses">;
  themeId?: Id<"themes">;
  onImport?: (themeId: Id<"themes">) => void;
}

export function ThemeImportExport({ businessId, themeId, onImport }: ThemeImportExportProps) {
  const [importData, setImportData] = useState("");
  const [exportData, setExportData] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  const exportTheme = useQuery(
    api.themeExport.exportTheme,
    themeId ? { themeId } : "skip"
  );
  
  const importThemeMutation = useMutation(api.themeExport.importTheme);

  // Update export data when theme is loaded
  if (exportTheme && !exportData) {
    setExportData(JSON.stringify(exportTheme, null, 2));
  }

  const handleExport = () => {
    if (!exportData) {
      toast.error("No theme data to export");
      return;
    }

    // Create a blob and download
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Theme exported successfully");
  };

  const handleCopy = async () => {
    if (!exportData) return;
    
    try {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error("Please provide theme data to import");
      return;
    }

    try {
      // Validate JSON
      JSON.parse(importData);
      
      const result = await importThemeMutation({
        themeData: importData,
        businessId,
      });
      
      if (result.success && result.themeId) {
        toast.success("Theme imported successfully");
        onImport?.(result.themeId);
        setImportData("");
        setFileName("");
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON format");
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to import theme");
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast.error("Please upload a JSON file");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      
      // Try to parse and validate
      try {
        const parsed = JSON.parse(content);
        if (!parsed.name || !parsed.config) {
          toast.error("Invalid theme file format");
          setImportData("");
          setFileName("");
        } else {
          toast.success("Theme file loaded successfully");
        }
      } catch {
        toast.error("Invalid JSON file");
        setImportData("");
        setFileName("");
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Theme</CardTitle>
          <CardDescription>
            Download or copy your theme configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {exportData ? (
            <>
              <div className="space-y-2">
                <Label>Theme Data</Label>
                <Textarea
                  value={exportData}
                  readOnly
                  className="font-mono text-xs"
                  rows={10}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExport} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1"
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-sm text-muted-foreground">
                Select a theme to export
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle>Import Theme</CardTitle>
          <CardDescription>
            Upload or paste a theme configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme-file">Upload Theme File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="theme-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("theme-file")?.click()}
                className="w-full"
              >
                <FileJson className="mr-2 h-4 w-4" />
                {fileName || "Choose File"}
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or paste JSON
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Theme JSON</Label>
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your theme JSON here..."
              className="font-mono text-xs"
              rows={10}
            />
          </div>
          
          <Button
            onClick={handleImport}
            disabled={!importData.trim()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Theme
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}