import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Boost</span>
            <span className="text-2xl font-bold text-foreground">MyCV</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="#products"
            className="transition-colors hover:text-primary"
          >
            Products
          </Link>
          <Link
            href="#services"
            className="transition-colors hover:text-primary"
          >
            Services
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-primary">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started Free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
