import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
