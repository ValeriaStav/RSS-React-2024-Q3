import { useRouteError } from 'react-router-dom';
import '../styles/ErrorPage.css';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
      <p className="title">404</p>
      <p className="text">Page Not Found</p>
    </div>
  );
};

export default ErrorPage;
