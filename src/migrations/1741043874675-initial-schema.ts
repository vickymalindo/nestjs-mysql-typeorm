import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialSchema1741043874675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "authStrategy" VARCHAR,
        "role" VARCHAR NOT NULL DEFAULT 'user',
        "profileId" INT UNIQUE
      )
    `);

    // Create 'user_profiles' table
    await queryRunner.query(`
            CREATE TABLE "user_profiles" (
              "id" SERIAL PRIMARY KEY,
              "firstName" VARCHAR NOT NULL,
              "lastname" VARCHAR NOT NULL,
              "age" INT NOT NULL,
              "birthdate" DATE NOT NULL
            )
          `);

    // Create 'user_posts' table
    await queryRunner.query(`
            CREATE TABLE "user_posts" (
              "id" SERIAL PRIMARY KEY,
              "title" VARCHAR NOT NULL,
              "description" VARCHAR NOT NULL,
              "userId" INT
            )
          `);

    // Create index on 'username' column in 'users' table
    await queryRunner.query(`
      CREATE INDEX "idx_username" ON "users" ("username")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_user_profile" ON "users" ("profileId")
    `);

    // Create index on 'title' column in 'user_posts' table
    await queryRunner.query(`
            CREATE INDEX "idx_title" ON "user_posts" ("title")
          `);

    // Create index on 'userId' column in 'user_posts' table
    await queryRunner.query(`
            CREATE INDEX "idx_posts_user" ON "user_posts" ("userId")
          `);

    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_users_profileId"
            FOREIGN KEY ("profileId") REFERENCES "user_profiles"("id")
            ON DELETE CASCADE
          `);

    // Add foreign key constraint to 'user_posts' table
    await queryRunner.query(`
            ALTER TABLE "user_posts"
            ADD CONSTRAINT "FK_user_posts_userId"
            FOREIGN KEY ("userId") REFERENCES "users"("id")
            ON DELETE CASCADE
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "user_posts" DROP CONSTRAINT "FK_user_posts_userId"
  `);

    // Drop foreign key constraint from 'user_profiles' table
    await queryRunner.query(`
    ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_user_profiles_userId"
  `);

    // Drop index from 'user_posts' table
    await queryRunner.query(`
    DROP INDEX "idx_posts_user"
  `);

    // Drop index from 'user_posts' table
    await queryRunner.query(`
    DROP INDEX "idx_title"
  `);

    // Drop 'user_posts' table
    await queryRunner.query(`
    DROP TABLE "user_posts"
  `);

    // Drop 'user_profiles' table
    await queryRunner.query(`
    DROP TABLE "user_profiles"
  `);

    // Drop index from 'users' table
    await queryRunner.query(`
    DROP INDEX "idx_firstname"
  `);

    // Drop 'users' table
    await queryRunner.query(`
    DROP TABLE "users"
  `);
  }
}
