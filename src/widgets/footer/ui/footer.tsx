'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import { Label } from '~/shared/ui/label';
import { LanguageSwitcher } from '~/features/i18n';
import { useTranslations } from 'next-intl';

export function Footer() {
    const [version, setVersion] = useState('');
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const t = useTranslations('footer');
    const tButton = useTranslations('button');

    useEffect(() => {
        fetch('/api/get-app-version')
            .then((res) => res.json())
            .then((data) => setVersion(data.version))
            .catch(console.error);
        queueMicrotask(() => setMounted(true));
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <footer className="bg-card border-t px-4 pt-4 pb-6 sm:pb-24">
            <div className="container mx-auto">
                <div className="flex flex-col-reverse items-center justify-center gap-6 text-center sm:flex-row-reverse sm:text-left">
                    <section className="flex flex-col gap-2">
                        <span className="text-sm">
                            {t('madeBy')}{' '}
                            <a
                                href="https://github.com/basedest"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium underline-offset-4 hover:underline"
                            >
                                {t('author')}
                            </a>
                        </span>
                        <span className="text-muted-foreground text-sm">
                            {t('version')} {version}
                        </span>
                        <span className="text-muted-foreground text-xs">{t('copyright')}</span>
                    </section>

                    <section className="flex flex-col gap-2">
                        <Label htmlFor="theme-select" className="text-sm">
                            {t('theme')}
                        </Label>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger id="theme-select" className="w-[180px]">
                                <SelectValue placeholder={tButton('selectTheme')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">{t('themeSystem')}</SelectItem>
                                <SelectItem value="dark">{t('themeDark')}</SelectItem>
                                <SelectItem value="light">{t('themeLight')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </section>

                    <LanguageSwitcher id="footer-language-select" className="flex flex-col gap-2" />
                </div>
            </div>
        </footer>
    );
}
