import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
        path: '/RSS-React-2024-Q3/?page/:page',
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
        path: `/RSS-React-2024-Q3/?page=/:page/details/:characterName`,
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
