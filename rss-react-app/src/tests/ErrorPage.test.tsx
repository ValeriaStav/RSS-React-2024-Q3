import { render, screen } from '@testing-library/react';
import { useRouteError } from 'react-router-dom';
import { vi } from 'vitest';
import ErrorPage from '../components/ErrorPage';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useRouteError: vi.fn(),
}));

describe('ErrorPage component', () => {
  test('renders with 404 title and Page Not Found text', () => {
    (useRouteError as jest.Mock).mockReturnValue(new Error('Test error'));

    render(<ErrorPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('calls useRouteError and logs the error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('Test error');
    (useRouteError as jest.Mock).mockReturnValue(error);

    render(<ErrorPage />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);

    consoleErrorSpy.mockRestore();
  });
});
