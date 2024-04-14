import app from './index';
import dbconnect from './db/db';

const port = 8000;

async function startServer() {
  try {
    await dbconnect();
    app.listen(port, () => {
      console.log(`Server running at ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

startServer();
