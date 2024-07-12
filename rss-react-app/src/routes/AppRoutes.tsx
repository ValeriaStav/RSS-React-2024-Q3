import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import NotFound from '../components/404';

const AppRoutes = () => {
  return (
    <Router basename="/RSS-React-2024-Q3/rss-react-app">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
