'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';

interface BusinessCreationProgressProps {
  currentStep: 'input' | 'preview' | 'complete';
}

export default function BusinessCreationProgress({ currentStep }: BusinessCreationProgressProps) {
  const steps = [
    { id: 'input', label: 'Enter URL', number: 1 },
    { id: 'preview', label: 'Review', number: 2 },
    { id: 'complete', label: 'Complete', number: 3 }
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 ${
              status === 'active' ? 'text-primary' : 
              status === 'complete' ? 'text-primary' : 
              'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                status === 'active' ? 'bg-primary text-primary-foreground' : 
                status === 'complete' ? 'bg-primary text-primary-foreground' : 
                'bg-muted'
              }`}>
                {status === 'complete' ? 
                  <CheckCircle className="w-5 h-5" /> : 
                  step.number
                }
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {step.label}
              </span>
            </div>
            
            {!isLast && (
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}