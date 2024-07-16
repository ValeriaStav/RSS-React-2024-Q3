import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/404';
import DetailedCard from './components/DetailedCard';
import SearchResults from './components/SearchResults';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '?page/:page',
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
        path: `?page=/:page/details/:characterName`,
        element: <DetailedCard character={null} onClose={() => {}} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
