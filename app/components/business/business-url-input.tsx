'use client';

import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { MapPin } from 'lucide-react';

interface BusinessUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  error?: string;
}

export default function BusinessUrlInput({ 
  value, 
  onChange, 
  onEnter, 
  disabled, 
  error 
}: BusinessUrlInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="businessUrl" className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Google Maps URL
      </Label>
      <Input
        id="businessUrl"
        type="url"
        placeholder="https://maps.google.com/..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter && !disabled) {
            onEnter();
          }
        }}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}