/*
  Warnings:

  - Removed unique constraint on establishments(owner_id, phone) to allow soft delete
  - Created partial unique index that only applies when deleted_at IS NULL
  - This allows creating new establishments with same phone after soft deleting previous ones

*/

-- Drop the existing unique constraint
DROP INDEX IF EXISTS "establishments_owner_id_phone_key";

-- Create a partial unique index that only enforces uniqueness for non-deleted establishments
CREATE UNIQUE INDEX "establishments_owner_id_phone_key" 
ON "establishments"("owner_id", "phone") 
WHERE "deleted_at" IS NULL;
