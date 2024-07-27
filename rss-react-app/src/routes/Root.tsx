import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../components/ErrorPage';

const Root = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      <Outlet />
    </Router>
  );
};

export default Root;
