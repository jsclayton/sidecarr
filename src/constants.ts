export const URL = (path = '') => {
  return (process.env.BASE_URL || 'http://localhost:8000') + path;
}
