import { Routes, Route } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../components/ErrorPage';

const Root = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Root;
