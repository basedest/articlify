'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '~/i18n/navigation';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import { Label } from '~/shared/ui/label';
import { useTranslations } from 'next-intl';
import { trpc } from '~/shared/api/trpc/client';
import { routing } from '~/i18n/routing';
import { cn } from '~/shared/lib/utils';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function setLocaleCookie(locale: string) {
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

interface LanguageSwitcherProps {
    id?: string;
    className?: string;
    variant?: 'default' | 'compact';
}

export function LanguageSwitcher({ id, className, variant = 'default' }: LanguageSwitcherProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const t = useTranslations('footer');
    const tCommon = useTranslations('common');
    const updatePreferredLanguageMutation = trpc.user.updatePreferredLanguage.useMutation();

    const handleChange = (newLocale: string) => {
        if (!routing.locales.includes(newLocale as 'en' | 'ru')) return;
        router.replace(pathname, { locale: newLocale });
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferredLanguage', newLocale);
            setLocaleCookie(newLocale);
        }
        if (session?.user?.id) {
            updatePreferredLanguageMutation.mutateAsync({ locale: newLocale as 'en' | 'ru' }).catch(() => {});
        }
    };

    if (variant === 'compact') {
        return (
            <div className={cn('flex items-center gap-0.5', className)} role="group" aria-label={t('language')}>
                {routing.locales.map((loc) => (
                    <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange(loc)}
                        className={cn(
                            'rounded px-2 py-1 text-xs font-medium transition-colors',
                            locale === loc
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {loc.toUpperCase()}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className={className}>
            <Label htmlFor={id ?? 'language-select'} className="text-sm">
                {t('language')}
            </Label>
            <Select value={locale} onValueChange={handleChange}>
                <SelectTrigger id={id ?? 'language-select'} className="w-[180px]">
                    <SelectValue placeholder={t('language')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">{tCommon('english')}</SelectItem>
                    <SelectItem value="ru">{tCommon('russian')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
