import { defineConfig } from '@prisma/client/generator-helper';

export default defineConfig({
  seed: {
    command: 'node prisma/seed.js'
  }
});
