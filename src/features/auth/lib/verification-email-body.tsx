import { Body, Button, Container, Head, Html, Section, Text } from '@react-email/components';
import * as React from 'react';

/**
 * Colors and styling aligned with app globals.css (primary green, background, muted).
 * Auth domain: used by sendVerificationEmail in auth config.
 */
const theme = {
    background: 'hsl(240 4% 94%)',
    card: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    mutedForeground: 'hsl(240 3.8% 46.1%)',
    primary: 'hsl(142 76% 36%)',
    primaryForeground: 'hsl(355.7 100% 97.3%)',
    radiusMd: '6px',
};

export function VerificationEmailBody({ url }: { url: string }) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Section style={section}>
                        <Text style={paragraph}>Please verify your email address by clicking the button below.</Text>
                        <Button style={button} href={url}>
                            Verify email
                        </Button>
                        <Text style={paragraphMuted}>If you did not create an account, you can ignore this email.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: theme.background,
    color: theme.foreground,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: theme.card,
    margin: '0 auto',
    padding: '40px 20px',
    marginBottom: '64px',
    borderRadius: theme.radiusMd,
};

const section = {
    padding: '0',
};

const paragraph = {
    margin: '0 0 16px',
    fontSize: '14px',
    lineHeight: '1.625',
    color: theme.foreground,
};

const paragraphMuted = {
    margin: '24px 0 0',
    fontSize: '14px',
    lineHeight: '1.5',
    color: theme.mutedForeground,
};

const button = {
    backgroundColor: theme.primary,
    color: theme.primaryForeground,
    borderRadius: theme.radiusMd,
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '10px 16px',
};
