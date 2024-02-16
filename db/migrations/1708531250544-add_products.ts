import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProducts1708531250544 implements MigrationInterface {
    name = 'AddProducts1708531250544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL, "category" integer NOT NULL, "images" text NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, "productsId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_d7e7f53b786522ae18147bb853c" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_4d542270767b10d95aa3ee12968" FOREIGN KEY ("productsId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_4d542270767b10d95aa3ee12968"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_d7e7f53b786522ae18147bb853c"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
