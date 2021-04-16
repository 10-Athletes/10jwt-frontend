// Constants.js
const prod = {
  url: {
    BASE_URL: 'https://jwt10.herokuapp.com/'
  }
};
const dev = {
 url: {
  BASE_URL: 'http://localhost:3001/'
 }
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}