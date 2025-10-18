-- Manual migration to add military table (run with prisma migrate dev or apply in DB)

CREATE TABLE IF NOT EXISTS "military" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "cpf" TEXT NOT NULL UNIQUE,
  "rank" TEXT NOT NULL,
  "photoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Note: gen_random_uuid() requires the pgcrypto extension or you can use uuid_generate_v4()
