import app from './app.js';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});

export default server;
