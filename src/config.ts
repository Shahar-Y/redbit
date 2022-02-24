import * as env from "env-var";

export const config = {
  redis: {
    port: env.get("REDIS_PORT").default(6379).asPortNumber(),
    host: env.get("REDIS_HOST").default("localhost").asString(),
    names: {
      connectedUsers: env.get("REDIS_CONNECTED_USERS").default("connected-users").asString(),
    },
  },
};
