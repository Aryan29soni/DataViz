// src/migrations/[timestamp]-add-google-columns.ts
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddGoogleColumns1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("user", [
            new TableColumn({
                name: "googleId",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "firstName",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "lastName",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "picture",
                type: "varchar",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "googleId");
        await queryRunner.dropColumn("user", "firstName");
        await queryRunner.dropColumn("user", "lastName");
        await queryRunner.dropColumn("user", "picture");
    }
}