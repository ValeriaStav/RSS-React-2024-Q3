import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../components/ErrorBoundary';

describe('ErrorBoundary component', () => {
  test('renders child component when there is no error', () => {
    const Child = () => <div>Child component</div>;

    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );

    expect(screen.getByText('Child component')).toBeInTheDocument();
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

  test('resets error state when "Try again" button is clicked', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    const Child = () => <div>Child component</div>;

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
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });
});
