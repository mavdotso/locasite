'use client';

import { useState, useCallback } from 'react';
// Note: Drag and drop functionality can be added later with @hello-pangea/dnd
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy,
  Image,
  Type,
  MapPin,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/app/lib/utils';

interface Section {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  text?: string;
  image?: string;
  visible?: boolean;
  [key: string]: unknown;
}

interface DragDropSectionEditorProps {
  page: {
    _id: Id<"pages">;
    content: string;
    slug: string;
  };
  onPreview?: (sections: Section[]) => void;
}

const SECTION_TYPES = [
  { type: 'hero', label: 'Hero Banner', icon: Image, description: 'Large banner with title and image' },
  { type: 'about', label: 'About Section', icon: Type, description: 'Text content about the business' },
  { type: 'info', label: 'Business Info', icon: Phone, description: 'Contact information and hours' },
  { type: 'gallery', label: 'Photo Gallery', icon: Image, description: 'Grid of business photos' },
  { type: 'reviews', label: 'Reviews', icon: Star, description: 'Customer reviews and ratings' },
  { type: 'contact', label: 'Contact Section', icon: Mail, description: 'Contact form and details' },
  { type: 'contactForm', label: 'Contact Form', icon: Mail, description: 'Simple contact form' },
  { type: 'map', label: 'Map', icon: MapPin, description: 'Location map' },
  { type: 'content', label: 'Text Content', icon: Type, description: 'Generic text content' },
  { type: 'header', label: 'Section Header', icon: Type, description: 'Section title and subtitle' },
];

export default function DragDropSectionEditor({ page, onPreview }: DragDropSectionEditorProps) {
  const updatePage = useMutation(api.pages.updatePage);
  
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const content = JSON.parse(page.content);
      return content.sections?.map((section: any, index: number) => ({
        ...section,
        id: section.id || `section-${index}`,
        visible: section.visible !== false
      })) || [];
    } catch {
      return [];
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const moveSection = useCallback((fromIndex: number, toIndex: number) => {
    const newSections = Array.from(sections);
    const [reorderedItem] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, reorderedItem);

    setSections(newSections);
    onPreview?.(newSections);
  }, [sections, onPreview]);

  const addSection = (type: string) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      visible: true,
      ...(type === 'hero' && { title: 'Welcome', subtitle: 'Discover our amazing services' }),
      ...(type === 'about' && { content: 'Tell your story here...' }),
      ...(type === 'content' && { text: 'Add your content here...' }),
      ...(type === 'header' && { title: 'Section Title' }),
      ...(type === 'contact' && { title: 'Get in Touch', subtitle: 'Contact us today' }),
    };

    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
    onPreview?.([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    const newSections: Section[] = sections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    setSections(newSections);
    onPreview?.(newSections);
  };

  const removeSection = (id: string) => {
    const newSections = sections.filter(section => section.id !== id);
    setSections(newSections);
    setSelectedSection(null);
    onPreview?.(newSections);
  };

  const duplicateSection = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;

    const newSection = {
      ...section,
      id: `section-${Date.now()}`,
    };

    const index = sections.findIndex(s => s.id === id);
    const newSections = [...sections];
    newSections.splice(index + 1, 0, newSection);

    setSections(newSections);
    onPreview?.(newSections);
  };

  const toggleSectionVisibility = (id: string) => {
    updateSection(id, { visible: !sections.find(s => s.id === id)?.visible });
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      
      const pageContent = {
        title: page.slug,
        sections: sections.map(({ id: _id, ...section }) => section)
      };

      await updatePage({
        pageId: page._id,
        content: JSON.stringify(pageContent),
      });

      toast.success('Page updated', {
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Error', {
        description: 'Failed to save changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSectionIcon = (type: string) => {
    const sectionType = SECTION_TYPES.find(t => t.type === type);
    const Icon = sectionType?.icon || Type;
    return <Icon className="w-4 h-4" />;
  };

  const renderSectionEditor = (section: Section) => {
    return (
      <div className="space-y-3">
        {section.type === 'hero' && (
          <>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={section.title || ''}
                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                value={section.subtitle || ''}
                onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Background Image URL</label>
              <Input
                value={section.image || ''}
                onChange={(e) => updateSection(section.id, { image: e.target.value })}
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </>
        )}

        {section.type === 'about' && (
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={section.content || ''}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              className="mt-1 min-h-[120px]"
              placeholder="Tell your business story..."
            />
          </div>
        )}

        {section.type === 'content' && (
          <div>
            <label className="text-sm font-medium">Text</label>
            <Textarea
              value={section.text || ''}
              onChange={(e) => updateSection(section.id, { text: e.target.value })}
              className="mt-1 min-h-[120px]"
              placeholder="Add your content here..."
            />
          </div>
        )}

        {section.type === 'header' && (
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.title || ''}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="mt-1"
              placeholder="Section title"
            />
          </div>
        )}

        {section.type === 'contact' && (
          <>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={section.title || ''}
                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                value={section.subtitle || ''}
                onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                className="mt-1"
              />
            </div>
          </>
        )}

        {section.type === 'contactForm' && (
          <div>
            <label className="text-sm font-medium">Form Title</label>
            <Input
              value={section.title || ''}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="mt-1"
              placeholder="Contact Us"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Section Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Sections</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {SECTION_TYPES.map((sectionType) => (
            <Button
              key={sectionType.type}
              variant="outline"
              onClick={() => addSection(sectionType.type)}
              className="h-auto p-3 justify-start text-left"
            >
              <div className="flex items-start gap-3">
                <sectionType.icon className="w-5 h-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">{sectionType.label}</div>
                  <div className="text-xs text-gray-500">{sectionType.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Page Sections</h3>
          <Button onClick={saveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Page'}
          </Button>
        </div>

        <div className="space-y-2">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className={cn(
                "cursor-pointer transition-all",
                selectedSection === section.id && "ring-2 ring-blue-500",
                !section.visible && "opacity-50"
              )}
              onClick={() => setSelectedSection(section.id)}
            >
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (index > 0) moveSection(index, index - 1);
                      }}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (index < sections.length - 1) moveSection(index, index + 1);
                      }}
                      disabled={index === sections.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                            
                            {getSectionIcon(section.type)}
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {SECTION_TYPES.find(t => t.type === section.type)?.label || section.type}
                                </span>
                                {!section.visible && (
                                  <Badge variant="secondary" className="text-xs">Hidden</Badge>
                                )}
                              </div>
                              {section.title && (
                                <div className="text-xs text-gray-500 mt-1">{section.title}</div>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSectionVisibility(section.id);
                                }}
                              >
                                {section.visible ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateSection(section.id);
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSection(section.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                  ))}
                </div>
      </div>

      {/* Section Editor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Section Properties</h3>
        
        {selectedSection ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Edit {SECTION_TYPES.find(t => t.type === sections.find(s => s.id === selectedSection)?.type)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sections.find(s => s.id === selectedSection) && 
                renderSectionEditor(sections.find(s => s.id === selectedSection)!)
              }
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a section to edit its properties</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}