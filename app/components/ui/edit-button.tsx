'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface EditButtonProps {
  businessId: Id<'businesses'>;
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function EditButton({ 
  businessId, 
  children, 
  variant = 'default',
  size = 'default',
  className = ''
}: EditButtonProps) {
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  // Always provide an edit link - either to published site editor or pre-domain editor
  const editUrl = domain 
    ? `/${domain.subdomain}/edit`  // Published business - use main editor (includes live preview)
    : `/dashboard/business/${businessId}`;  // Unpublished business - use dashboard editor

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href={editUrl}>
        {children}
      </Link>
    </Button>
  );
}