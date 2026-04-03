import app from './src/app';
import { connectDatabase } from './src/config/database';
import { env } from './src/config/env';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Unable to start server', error);
    process.exit(1);
  }
};

void startServer();
