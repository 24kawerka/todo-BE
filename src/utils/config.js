import 'dotenv/config';
export const config = {
  key: process.env.SECRET_KEY,
  mongoUrl: process.env.MONGO_URL,
};
