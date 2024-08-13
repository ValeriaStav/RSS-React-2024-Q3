import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../context/ThemeContext';
import { store } from '../store/store';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../components/ErrorPage';
import DetailedCard from '../components/DetailedCard';
import SearchResults from '../components/SearchResults';

const routes = [
  {
    path: '/RSS-React-2024-Q3/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'page/:page',
        element: (
          <SearchResults
            results={[]}
            onCharacterSelect={() => {}}
            currentPage={0}
            onPageChange={() => {}}
            onCardClick={() => {}}
          />
        ),
      },
      {
        path: 'page=/:page/details/:characterName',
        element: <DetailedCard character={null} onClose={() => {}} />,
      },
    ],
  },
];

describe('Main Application', () => {
  test('renders without crashing', () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/RSS-React-2024-Q3/'],
    });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
