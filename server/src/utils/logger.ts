import pino from "pino";
import { ENV } from "../config/env";

export const logger = pino(
  ENV.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
    : {} // production → no pretty logs
);