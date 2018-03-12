import axios from 'axios';

export default async function getUsernameByToken(token) {
  const headers = { Authorization: token };
  const response = await axios.get('https://api.github.com/user', { headers });
  return response.data.login;
}
