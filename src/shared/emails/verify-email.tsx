import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { createTranslator } from 'next-intl';

/**
 * Colors and styling aligned with app globals.css (primary green, background, muted).
 * Auth domain: used by sendVerificationEmail in auth config.
 */
const theme = {
    background: '#f4f4f5',
    card: '#ffffff',
    foreground: '#09090b',
    mutedForeground: '#71717a',
    primary: 'hsl(142 76% 36%)',
    primaryForeground: '#fef2f2',
    border: '#e4e4e7',
    radiusMd: '6px',
};

type VerificationEmailBodyProps = {
    url: string;
    locale?: string;
};

export default async function VerificationEmailBody({ url, locale = 'en' }: VerificationEmailBodyProps) {
    const messages = await import(`../lib/locales/${locale}.json`);
    const t = createTranslator({ messages, namespace: 'email.verifyEmail', locale });

    return (
        <Html>
            <Head />
            <Preview>{t('preview')}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Text style={logoText}>Articlify</Text>
                    </Section>
                    <Heading style={heading}>{t('heading')}</Heading>
                    <Text style={paragraph}>{t('body')}</Text>
                    <Section style={buttonSection}>
                        <Button style={button} href={url}>
                            {t('button')}
                        </Button>
                    </Section>
                    <Text style={paragraphSmall}>
                        {t('fallback')}{' '}
                        <Link href={url} style={link}>
                            {url}
                        </Link>
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>{t('footer')}</Text>
                </Container>
            </Body>
        </Html>
    );
}

VerificationEmailBody.PreviewProps = {
    url: 'https://articlify.basedest.tech/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imkuc2hjaGVyYmFrb3ZAdmsudGVhbSIsImlhdCI6MTc3MTc0NDc2NSwiZXhwIjoxNzcxNzQ4MzY1fQ.m7GlIyJlOM6YSOtZxciLwhji2_gkbZW2dmGlyN6FGhU&callbackURL=%2F',
    locale: 'en',
} as VerificationEmailBodyProps;

const main = {
    backgroundColor: theme.background,
    color: theme.foreground,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radiusMd,
    margin: '40px auto',
    maxWidth: '465px',
    padding: '32px 28px',
};

const logoSection = {
    marginBottom: '28px',
    textAlign: 'center' as const,
};

const logoText = {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.foreground,
    letterSpacing: '-0.3px',
    margin: '0',
};

const heading = {
    fontSize: '22px',
    fontWeight: '600',
    color: theme.foreground,
    margin: '0 0 12px',
    padding: '0',
    textAlign: 'center' as const,
};

const paragraph = {
    fontSize: '14px',
    lineHeight: '1.625',
    color: theme.foreground,
    margin: '0 0 24px',
    textAlign: 'center' as const,
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '0 0 24px',
};

const button = {
    backgroundColor: theme.primary,
    color: theme.primaryForeground,
    borderRadius: theme.radiusMd,
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '10px 24px',
};

const paragraphSmall = {
    fontSize: '12px',
    lineHeight: '1.5',
    color: theme.mutedForeground,
    margin: '0',
    wordBreak: 'break-all' as const,
};

const link = {
    color: theme.primary,
    textDecoration: 'underline',
};

const hr = {
    borderColor: theme.border,
    margin: '24px 0',
};

const footer = {
    fontSize: '12px',
    lineHeight: '1.5',
    color: theme.mutedForeground,
    margin: '0',
};
