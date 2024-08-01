import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  test('renders without crashing', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /throw error/i })
    ).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  test('calls onSearch with input value and showError on search button click', () => {
    const onSearchMock = vi.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test search' } });
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    expect(onSearchMock).toHaveBeenCalledWith('test search', false);
  });

  test('throws an error when "Throw Error" button is clicked', () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    render(<SearchBar onSearch={vi.fn()} />);
    const throwErrorButton = screen.getByRole('button', {
      name: /throw error/i,
    });
    expect(() => {
      fireEvent.click(throwErrorButton);
    }).toThrow('This is a test error thrown by user');
    consoleErrorMock.mockRestore();
  });
});
