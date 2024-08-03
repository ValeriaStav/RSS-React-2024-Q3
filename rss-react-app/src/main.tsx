import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './store/store';
import App from './App';
import ErrorPage from './components/ErrorPage';
import DetailedCard from './components/DetailedCard';
import SearchResults from './components/SearchResults';
import './index.css';

const router = createBrowserRouter([
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
        path: `page=/:page/details/:characterName`,
        element: <DetailedCard character={null} onClose={() => {}} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
