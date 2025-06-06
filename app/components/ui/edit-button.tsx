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
  pageSlug?: string; // Optional page slug, defaults to "home"
}

export default function EditButton({ 
  businessId, 
  children, 
  variant = 'default',
  size = 'default',
  className = '',
  pageSlug = 'home'
}: EditButtonProps) {
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  // Always use unified editor with business ID
  const editUrl = `/business/${businessId}/edit`;

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href={editUrl}>
        {children}
      </Link>
    </Button>
  );
}