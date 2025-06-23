import BusinessCreationForm from '@/app/components/business/business-creation-form';
import Logo from "./components/ui/logo";

export default function HomePage() {
  return (
    <div className="min-h-screen py-12 bg-muted">
      <div className="container max-w-4xl px-4 mx-auto">
        <div className="mb-8 text-center">
          <Logo width={40} height={40} className="justify-center mb-6" />
        </div>
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Business Site Generator</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Create a professional website for your business in minutes
          </p>
        </div>

        <BusinessCreationForm className="max-w-2xl mx-auto" />
      </div>
    </div>
  );
}