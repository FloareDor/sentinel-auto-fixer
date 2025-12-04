import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Sentinel MVP - shadcn/ui Test</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Testing shadcn/ui components: Button, Card, Textarea, Badge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button Test */}
          <Card>
            <CardHeader>
              <CardTitle>Button Component</CardTitle>
              <CardDescription>Testing different button variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Test */}
          <Card>
            <CardHeader>
              <CardTitle>Card Component</CardTitle>
              <CardDescription>Nested card structure</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Nested Card</CardTitle>
                  <CardDescription>Testing card composition</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is a nested card to test component composition.</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Textarea Test */}
          <Card>
            <CardHeader>
              <CardTitle>Textarea Component</CardTitle>
              <CardDescription>Form input testing</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter some text here..."
                className="min-h-[100px]"
                defaultValue="This is a test textarea component."
              />
            </CardContent>
          </Card>

          {/* Badge Test */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Component</CardTitle>
              <CardDescription>Status and label testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            ✅ shadcn/ui Test Status
          </h3>
          <ul className="text-green-700 dark:text-green-300 space-y-1">
            <li>✓ Components render successfully</li>
            <li>✓ Tailwind CSS classes applied</li>
            <li>✓ Button, Card, Textarea, Badge components imported</li>
            <li>✓ Component variants and sizes work</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
