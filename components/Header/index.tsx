'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import UserMenu from '../UserMenu';
import { categories } from '@/lib/lib';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, PenSquare } from 'lucide-react';
import { useState } from 'react';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Articlify
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link
                      href={`/${category}`}
                      className="w-full cursor-pointer capitalize"
                    >
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/editor">
              <Button variant="ghost">
                <PenSquare className="mr-2 h-4 w-4" />
                Editor
              </Button>
            </Link>

            {!loading && !session && (
              <Link href="/login">
                <Button variant="default">Sign In</Button>
              </Link>
            )}

            {session && <UserMenu />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t pb-4 md:hidden">
            <div className="flex flex-col gap-2 px-4 pt-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>

              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/${category}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start capitalize"
                  >
                    {category}
                  </Button>
                </Link>
              ))}

              <Link href="/editor" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Editor
                </Button>
              </Link>

              {!loading && !session && (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;