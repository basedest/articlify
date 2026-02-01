import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reducer } from '../use-toast';

describe('reducer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('happy path', () => {
        it('ADD_TOAST prepends toast and limits to TOAST_LIMIT (1)', () => {
            const state = { toasts: [] };
            const action = {
                type: 'ADD_TOAST' as const,
                toast: { id: '1', title: 'Hi', open: true },
            };

            const next = reducer(state, action);

            expect(next.toasts).toHaveLength(1);
            expect(next.toasts[0]).toMatchObject({ id: '1', title: 'Hi', open: true });
        });

        it('ADD_TOAST keeps only first TOAST_LIMIT toasts', () => {
            const state = {
                toasts: [{ id: 'existing', open: true }],
            };
            const action = {
                type: 'ADD_TOAST' as const,
                toast: { id: 'new', open: true },
            };

            const next = reducer(state, action);

            expect(next.toasts).toHaveLength(1);
            expect(next.toasts[0].id).toBe('new');
        });

        it('UPDATE_TOAST updates toast by id', () => {
            const state = {
                toasts: [
                    { id: '1', title: 'Old', open: true },
                    { id: '2', title: 'Other', open: true },
                ],
            };
            const action = {
                type: 'UPDATE_TOAST' as const,
                toast: { id: '1', title: 'Updated' },
            };

            const next = reducer(state, action);

            expect(next.toasts[0]).toMatchObject({ id: '1', title: 'Updated', open: true });
            expect(next.toasts[1]).toMatchObject({ id: '2', title: 'Other' });
        });

        it('REMOVE_TOAST removes toast by id', () => {
            const state = {
                toasts: [
                    { id: '1', open: true },
                    { id: '2', open: true },
                ],
            };
            const action = { type: 'REMOVE_TOAST' as const, toastId: '1' };

            const next = reducer(state, action);

            expect(next.toasts).toHaveLength(1);
            expect(next.toasts[0].id).toBe('2');
        });

        it('REMOVE_TOAST with undefined toastId clears all toasts', () => {
            const state = {
                toasts: [
                    { id: '1', open: true },
                    { id: '2', open: true },
                ],
            };
            const action = { type: 'REMOVE_TOAST' as const, toastId: undefined };

            const next = reducer(state, action);

            expect(next.toasts).toHaveLength(0);
        });
    });

    describe('edge cases', () => {
        it('DISMISS_TOAST sets open false for matching toastId', () => {
            const state = {
                toasts: [
                    { id: '1', open: true },
                    { id: '2', open: true },
                ],
            };
            const action = { type: 'DISMISS_TOAST' as const, toastId: '1' };

            const next = reducer(state, action);

            expect(next.toasts[0]).toMatchObject({ id: '1', open: false });
            expect(next.toasts[1]).toMatchObject({ id: '2', open: true });
        });

        it('DISMISS_TOAST with undefined toastId sets open false for all toasts', () => {
            const state = {
                toasts: [
                    { id: '1', open: true },
                    { id: '2', open: true },
                ],
            };
            const action = { type: 'DISMISS_TOAST' as const, toastId: undefined };

            const next = reducer(state, action);

            expect(next.toasts[0]).toMatchObject({ id: '1', open: false });
            expect(next.toasts[1]).toMatchObject({ id: '2', open: false });
        });
    });
});
