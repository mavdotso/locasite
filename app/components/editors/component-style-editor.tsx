"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import { Switch } from "@/app/components/ui/switch";
import { ComponentStylesSchema } from "@/types/theme";
import { HexColorPicker } from "react-colorful";
import { Square, Link2, CreditCard, FormInput } from "lucide-react";

interface ComponentStyleEditorProps {
  styles: Partial<ComponentStylesSchema>;
  onChange: (styles: Partial<ComponentStylesSchema>) => void;
}

export function ComponentStyleEditor({ styles, onChange }: ComponentStyleEditorProps) {
  const [activeComponent, setActiveComponent] = useState("button");
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);

  const handleButtonStyleChange = (
    variant: string,
    state: string,
    value: string
  ) => {
    onChange({
      ...styles,
      button: {
        ...styles.button,
        variants: {
          ...styles.button?.variants,
          [variant]: {
            ...styles.button?.variants?.[variant as keyof typeof styles.button.variants],
            [state]: value,
          },
        },
      },
    });
  };

  const handleButtonSizeChange = (size: string, property: string, value: string) => {
    onChange({
      ...styles,
      button: {
        ...styles.button,
        sizes: {
          ...styles.button?.sizes,
          [size]: {
            ...styles.button?.sizes?.[size as keyof typeof styles.button.sizes],
            [property]: value,
          },
        },
      },
    });
  };

  const handleLinkStyleChange = (property: string, value: string | boolean) => {
    onChange({
      ...styles,
      link: {
        ...styles.link,
        [property]: value,
      },
    });
  };

  const handleCardStyleChange = (property: string, value: string) => {
    onChange({
      ...styles,
      card: {
        ...styles.card,
        [property]: value,
      },
    });
  };

  const handleInputStyleChange = (property: string, value: string) => {
    onChange({
      ...styles,
      input: {
        ...styles.input,
        [property]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeComponent} onValueChange={setActiveComponent}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="button">
            <Square className="mr-2 h-4 w-4" />
            Buttons
          </TabsTrigger>
          <TabsTrigger value="link">
            <Link2 className="mr-2 h-4 w-4" />
            Links
          </TabsTrigger>
          <TabsTrigger value="card">
            <CreditCard className="mr-2 h-4 w-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="input">
            <FormInput className="mr-2 h-4 w-4" />
            Inputs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="button" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Customize the appearance of different button variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {["primary", "secondary", "outline", "ghost"].map((variant) => (
                <div key={variant} className="space-y-4">
                  <h4 className="font-medium capitalize">{variant} Variant</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {["base", "hover", "active", "disabled"].map((state) => (
                      <div key={state} className="space-y-2">
                        <Label className="text-xs capitalize">{state}</Label>
                        <Input
                          value={styles.button?.variants?.[variant as keyof typeof styles.button.variants]?.[state as keyof typeof styles.button.variants.primary] || ""}
                          onChange={(e) =>
                            handleButtonStyleChange(variant, state, e.target.value)
                          }
                          placeholder="CSS classes"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant={variant as any} disabled>
                      Preview Disabled
                    </Button>
                    <Button variant={variant as any}>Preview Default</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>Define sizing options for buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["sm", "md", "lg"].map((size) => (
                <div key={size} className="space-y-3">
                  <h4 className="font-medium capitalize">{size} Size</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Padding</Label>
                      <Input
                        value={styles.button?.sizes?.[size as keyof typeof styles.button.sizes]?.padding || ""}
                        onChange={(e) =>
                          handleButtonSizeChange(size, "padding", e.target.value)
                        }
                        placeholder="0.5rem 1rem"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Input
                        value={styles.button?.sizes?.[size as keyof typeof styles.button.sizes]?.fontSize || ""}
                        onChange={(e) =>
                          handleButtonSizeChange(size, "fontSize", e.target.value)
                        }
                        placeholder="0.875rem"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        value={styles.button?.sizes?.[size as keyof typeof styles.button.sizes]?.height || ""}
                        onChange={(e) =>
                          handleButtonSizeChange(size, "height", e.target.value)
                        }
                        placeholder="2.5rem"
                      />
                    </div>
                  </div>
                  <Button size={size as any}>Preview {size}</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Properties</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input
                  value={styles.button?.borderRadius || ""}
                  onChange={(e) =>
                    onChange({
                      ...styles,
                      button: {
                        ...styles.button,
                        borderRadius: e.target.value,
                      },
                    })
                  }
                  placeholder="0.375rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  value={styles.button?.fontWeight || "500"}
                  onValueChange={(value) =>
                    onChange({
                      ...styles,
                      button: {
                        ...styles.button,
                        fontWeight: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semibold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transition</Label>
                <Input
                  value={styles.button?.transition || ""}
                  onChange={(e) =>
                    onChange({
                      ...styles,
                      button: {
                        ...styles.button,
                        transition: e.target.value,
                      },
                    })
                  }
                  placeholder="all 150ms ease"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Styles</CardTitle>
              <CardDescription>Customize link appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Base Style</Label>
                  <Input
                    value={styles.link?.base || ""}
                    onChange={(e) => handleLinkStyleChange("base", e.target.value)}
                    placeholder="text-primary underline-offset-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hover Style</Label>
                  <Input
                    value={styles.link?.hover || ""}
                    onChange={(e) => handleLinkStyleChange("hover", e.target.value)}
                    placeholder="text-primary/80 underline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visited Style</Label>
                  <Input
                    value={styles.link?.visited || ""}
                    onChange={(e) => handleLinkStyleChange("visited", e.target.value)}
                    placeholder="text-primary/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transition</Label>
                  <Input
                    value={styles.link?.transition || ""}
                    onChange={(e) => handleLinkStyleChange("transition", e.target.value)}
                    placeholder="all 150ms ease"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={styles.link?.underline || false}
                  onCheckedChange={(checked) => handleLinkStyleChange("underline", checked)}
                />
                <Label>Show underline by default</Label>
              </div>
              <div className="flex gap-4">
                <a href="#" className="text-primary">
                  Preview Link
                </a>
                <a href="#" className="text-primary hover:text-primary/80 hover:underline">
                  Preview Hover
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Styles</CardTitle>
              <CardDescription>Customize card container appearance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input
                  value={styles.card?.borderRadius || ""}
                  onChange={(e) => handleCardStyleChange("borderRadius", e.target.value)}
                  placeholder="0.5rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Box Shadow</Label>
                <Input
                  value={styles.card?.boxShadow || ""}
                  onChange={(e) => handleCardStyleChange("boxShadow", e.target.value)}
                  placeholder="0 1px 3px 0 rgb(0 0 0 / 0.1)"
                />
              </div>
              <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                  value={styles.card?.padding || ""}
                  onChange={(e) => handleCardStyleChange("padding", e.target.value)}
                  placeholder="1.5rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Border Width</Label>
                <Input
                  value={styles.card?.borderWidth || ""}
                  onChange={(e) => handleCardStyleChange("borderWidth", e.target.value)}
                  placeholder="1px"
                />
              </div>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <Input
                  value={styles.card?.borderColor || ""}
                  onChange={(e) => handleCardStyleChange("borderColor", e.target.value)}
                  placeholder="border"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Preview Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is how your cards will look with the current settings.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Styles</CardTitle>
              <CardDescription>Customize form input appearance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input
                  value={styles.input?.borderRadius || ""}
                  onChange={(e) => handleInputStyleChange("borderRadius", e.target.value)}
                  placeholder="0.375rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Border Width</Label>
                <Input
                  value={styles.input?.borderWidth || ""}
                  onChange={(e) => handleInputStyleChange("borderWidth", e.target.value)}
                  placeholder="1px"
                />
              </div>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <Input
                  value={styles.input?.borderColor || ""}
                  onChange={(e) => handleInputStyleChange("borderColor", e.target.value)}
                  placeholder="border"
                />
              </div>
              <div className="space-y-2">
                <Label>Focus Border Color</Label>
                <Input
                  value={styles.input?.focusBorderColor || ""}
                  onChange={(e) =>
                    handleInputStyleChange("focusBorderColor", e.target.value)
                  }
                  placeholder="ring"
                />
              </div>
              <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                  value={styles.input?.padding || ""}
                  onChange={(e) => handleInputStyleChange("padding", e.target.value)}
                  placeholder="0.5rem 0.75rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Input
                  value={styles.input?.fontSize || ""}
                  onChange={(e) => handleInputStyleChange("fontSize", e.target.value)}
                  placeholder="0.875rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Transition</Label>
                <Input
                  value={styles.input?.transition || ""}
                  onChange={(e) => handleInputStyleChange("transition", e.target.value)}
                  placeholder="all 150ms ease"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Preview Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sample Input</Label>
                <Input placeholder="Type something..." />
              </div>
              <div className="space-y-2">
                <Label>Focused Input</Label>
                <Input placeholder="This input is focused" className="ring-2 ring-ring" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}