import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function apiCall(method, path, data) {
  return new Promise((resolve, reject) => axios[method](path, data)
    .then(res => resolve(res.data))
    .catch(err => reject(err.response.data.error)));
}