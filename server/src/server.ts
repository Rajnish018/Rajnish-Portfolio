import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import { logger } from "./utils/logger";

let server: any;

const startServer = async () => {
  try {
    // DB connection first
    await connectDB();

    server = app.listen(ENV.PORT, () => {
      logger.info(` Server running on port http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    logger.error(" Failed to start server");
    process.exit(1);
  }
};

startServer();


// -----------------------------
// GLOBAL ERROR HANDLING
// -----------------------------

process.on("unhandledRejection", (err: any) => {
  logger.error(" UNHANDLED REJECTION");
  logger.error(err);
  shutdown();
});

process.on("uncaughtException", (err: any) => {
  logger.error(" UNCAUGHT EXCEPTION");
  logger.error(err);
  shutdown();
});


// -----------------------------
// GRACEFUL SHUTDOWN
// -----------------------------

const shutdown = () => {
  if (server) {
    server.close(() => {
      logger.info(" Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  logger.info(" SIGINT received");
  shutdown();
});

process.on("SIGTERM", () => {
  logger.info(" SIGTERM received");
  shutdown();
});