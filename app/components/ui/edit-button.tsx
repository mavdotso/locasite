'use client';

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