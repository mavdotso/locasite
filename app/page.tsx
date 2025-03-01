import Scraper from './components/scraper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';

export default function ScraperTest() {
  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="mx-auto px-4 max-w-4xl container">
        <Card className="shadow-lg border-none">
          <CardHeader className="text-center">
            <CardTitle className="font-bold text-3xl">Business Site Generator</CardTitle>
            <CardDescription className="mt-2 text-lg">
              Enter a business URL to generate a beautiful website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Scraper />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}