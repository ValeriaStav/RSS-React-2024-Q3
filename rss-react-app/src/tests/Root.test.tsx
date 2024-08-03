import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Root from '../routes/Root';
import { vi } from 'vitest';

vi.mock('../App', () => ({
  __esModule: true,
  default: () => <div>App Component</div>,
}));

vi.mock('../components/ErrorPage', () => ({
  __esModule: true,
  default: () => <div>Error Page</div>,
}));

describe('Root Component', () => {
  test('renders App component at the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<Root />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('App Component')).toBeInTheDocument();
  });

  test('renders ErrorPage component for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Routes>
          <Route path="*" element={<Root />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Error Page')).toBeInTheDocument();
  });
});
