import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';

describe('ErrorBoundary Component', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('renders child component if no error', () => {
    const Child = () => <div>Child Component</div>;

    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  test('catches error and displays fallback UI', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong😔')).toBeInTheDocument();
    expect(
      screen.getByText('We apologize for the inconvenience')
    ).toBeInTheDocument();
  });

  test('resets error state on retry button click', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    const Child = () => <div>Child Component</div>;

    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong😔')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try again'));

    expect(
      screen.queryByText('Something went wrong😔')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
});
