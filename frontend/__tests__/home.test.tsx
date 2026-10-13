import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import Home from '../app/page';

const { getDocs } = vi.hoisted(() => ({ getDocs: vi.fn() }));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
  collection: vi.fn(() => ({})),
  getDocs,
}));

function fakeDocs(rows: Record<string, unknown>[]) {
  return { docs: rows.map((r) => ({ data: () => r })) };
}

describe('Home com fonte firestore', () => {
  beforeEach(() => { getDocs.mockReset(); });
  afterEach(() => cleanup());

  it('lista os itens do Firestore em ordem', async () => {
    getDocs.mockResolvedValue(
      fakeDocs([
        { nome: 'item 3', ordem: 3 },
        { nome: 'item 1', ordem: 1 },
        { nome: 'item 2', ordem: 2 },
      ])
    );
    render(<Home />);
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(3));
    const textos = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(textos).toEqual(['item 1', 'item 2', 'item 3']);
  });

  it('mostra o estado de erro amigavel quando a leitura falha', async () => {
    getDocs.mockImplementation(() => { throw new Error('permission-denied'); });
    render(<Home />);
    await waitFor(() =>
      expect(screen.getByText('Dados indisponíveis')).toBeTruthy()
    );
  });
});