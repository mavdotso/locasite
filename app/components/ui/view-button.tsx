'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { ReactNode } from 'react';

interface ViewButtonProps {
  businessId: Id<'businesses'>;
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function ViewButton({ 
  businessId, 
  children, 
  variant = 'default',
  size = 'default',
  className = ''
}: ViewButtonProps) {
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'locasite.xyz';
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!domain) {
    // If no domain exists, the business isn't published yet, so no view link
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {children}
      </Button>
    );
  }

  // Generate the correct URL based on environment
  const url = isDevelopment 
    ? `http://${domain.subdomain}.localhost:3000`
    : `https://${domain.subdomain}.${rootDomain}`;

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}