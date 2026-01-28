'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const Footer: React.FC = () => {
  const [version, setVersion] = useState('');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetch('/api/get-app-version')
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(console.error);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <footer className="border-t bg-muted/30 px-4 pb-6 pt-4 sm:pb-24">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse items-center justify-center gap-6 text-center sm:flex-row-reverse sm:text-left">
          <section className="flex flex-col gap-2">
            <span className="text-sm">
              Made by{' '}
              <a
                href="https://github.com/basedest"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Ivan Scherbakov
              </a>
            </span>
            <span className="text-sm text-muted-foreground">
              Version {version}
            </span>
            <span className="text-xs text-muted-foreground">
              Copyright © 2022-2025 Articlify Inc. All rights reserved.
            </span>
          </section>

          <section className="flex flex-col gap-2">
            <Label htmlFor="theme-select" className="text-sm">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme-select" className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default Footer;