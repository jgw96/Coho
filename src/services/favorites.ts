import { FIREBASE_FUNCTIONS_BASE_URL } from '../config/firebase';

// Helper functions to always get fresh values from localStorage
const getServer = () => localStorage.getItem('server') || '';
const getAccessToken = () => localStorage.getItem('accessToken') || '';

export const getFavorites = async () => {
  const accessToken = getAccessToken();
  const server = getServer();
  const response = await fetch(
    `${FIREBASE_FUNCTIONS_BASE_URL}/getFavorites?code=${accessToken}&server=${server}`
  );
  const data = await response.json();
  return data;
};
