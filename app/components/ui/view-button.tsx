'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
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

  if (!domain) {
    // If no domain exists, the business isn't published yet, so no view link
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {children}
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href={`/${domain.subdomain}`}>
        {children}
      </Link>
    </Button>
  );
}