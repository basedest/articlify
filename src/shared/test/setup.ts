/// <reference types="vitest/globals" />
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './msw/handlers';

const server = setupServer(...(handlers as Parameters<typeof setupServer>));

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
