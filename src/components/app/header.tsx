
import { ClipboardList } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verbalist
          </h1>
        </div>
      </div>
    </header>
  );
}
