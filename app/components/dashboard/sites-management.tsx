'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id, Doc } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { 
  Globe, 
  Plus,
  Edit3,
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Trash,
  Lock,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import EditButton from '@/app/components/ui/edit-button';
import ViewButton from '@/app/components/ui/view-button';
import { PublishDialog } from '@/app/components/business/publish-dialog';

type SiteStatus = 'all' | 'published' | 'draft' | 'pending';

export default function SitesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SiteStatus>('all');
  const [publishDialogBusiness, setPublishDialogBusiness] = useState<{ id: Id<"businesses">, name: string } | null>(null);
  
  const user = useQuery(api.auth.currentUser);
  const userBusinesses = useQuery(api.businesses.listByUser, 
    user ? { userId: user._id } : 'skip'
  );

  const deleteBusiness = useMutation(api.businesses.remove);
  const unpublishBusiness = useMutation(api.businesses.unpublish);

  // Filter businesses based on search and status
  const filteredBusinesses = userBusinesses?.filter((business: Doc<"businesses">) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && business.isPublished) ||
      (statusFilter === 'draft' && !business.isPublished && business.userId) ||
      (statusFilter === 'pending' && !business.userId);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDeleteSite = async (businessId: Id<"businesses">, businessName: string) => {
    if (window.confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      try {
        await deleteBusiness({ id: businessId });
        toast.success('Site deleted successfully');
      } catch (error) {
        console.error('Error deleting site:', error);
        toast.error('Failed to delete site');
      }
    }
  };


  const handleUnpublish = async (businessId: Id<"businesses">) => {
    try {
      await unpublishBusiness({ businessId });
      toast.success('Site unpublished successfully');
    } catch (error) {
      console.error('Error unpublishing site:', error);
      toast.error('Failed to unpublish site');
    }
  };

  const getSiteStatus = (business: Doc<"businesses">) => {
    if (business.isPublished) return 'published';
    if (business.userId) return 'draft';
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const statusCounts = {
    all: filteredBusinesses.length,
    published: filteredBusinesses.filter((b: Doc<"businesses">) => b.isPublished).length,
    draft: filteredBusinesses.filter((b: Doc<"businesses">) => !b.isPublished && b.userId).length,
    pending: filteredBusinesses.filter((b: Doc<"businesses">) => !b.userId).length,
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your sites.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 w-4 h-4" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/sites/new">
              <Plus className="w-4 h-4 mr-2" />
              New Site
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(['all', 'published', 'draft', 'pending'] as SiteStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              statusFilter === status
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Sites Grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business: Doc<"businesses">) => (
            <Card key={business._id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{business.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{business.address}</span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(getSiteStatus(business))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Site Preview */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {business.photos && business.photos[0] ? (
                    <Image 
                      src={business.photos[0]} 
                      alt={business.name}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Globe className="w-8 h-8 text-muted-foreground/50" />
                  )}
                </div>

                {/* Site Info */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {business.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Created {new Date(business.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {business.isPublished ? (
                    <>
                      <ViewButton businessId={business._id} size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </ViewButton>
                      <EditButton businessId={business._id} size="sm" className="flex-1">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </EditButton>
                    </>
                  ) : (
                    <>
                      <EditButton businessId={business._id} size="sm" variant="outline" className="flex-1">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </EditButton>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setPublishDialogBusiness({ id: business._id, name: business.name })}
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Publish
                      </Button>
                    </>
                  )}
                  
                  {/* More Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="px-2"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/business/${business._id}/domain`}>
                          <Settings className="w-3 h-3 mr-2" />
                          Domain Settings
                        </Link>
                      </DropdownMenuItem>
                      {business.isPublished && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUnpublish(business._id)}>
                            <Lock className="w-3 h-3 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteSite(business._id, business.name)}
                      >
                        <Trash className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Quick Stats (for published sites) */}
                {business.isPublished && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">0</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">0</div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">0</div>
                      <div className="text-xs text-muted-foreground">Visitors</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' ? (
              <>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No sites found</h3>
                <p className="mb-4">Try adjusting your search or filter criteria.</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}>
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No sites yet</h3>
                <p className="mb-4">Create your first business website to get started.</p>
                <Button asChild>
                  <Link href="/dashboard/sites/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Site
                  </Link>
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      
      {/* Publish Dialog */}
      {publishDialogBusiness && (
        <PublishDialog
          businessId={publishDialogBusiness.id}
          businessName={publishDialogBusiness.name}
          open={!!publishDialogBusiness}
          onOpenChange={(open) => !open && setPublishDialogBusiness(null)}
          onPublishComplete={() => {
            setPublishDialogBusiness(null);
          }}
        />
      )}
    </div>
  );
}