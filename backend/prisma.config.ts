import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    // Added for the HR-domain seed. Prisma 7 reads the seed command from here
    // rather than from package.json's "prisma" key, which it now ignores.
    // `-P tsconfig.tools.json` is what lets the seed import from ../src (the
    // base tsconfig roots at src/ because only src/ ships in dist/).
    seed: "ts-node -P tsconfig.tools.json prisma/seed.ts",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
