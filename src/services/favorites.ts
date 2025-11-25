import { FIREBASE_FUNCTIONS_BASE_URL } from '../config/firebase';

const server = localStorage.getItem('server') || '';
const accessToken = localStorage.getItem('accessToken') || '';

export const getFavorites = async () => {
  const response = await fetch(
    `${FIREBASE_FUNCTIONS_BASE_URL}/getFavorites?code=${accessToken}&server=${server}`
  );
  const data = await response.json();
  return data;
};
