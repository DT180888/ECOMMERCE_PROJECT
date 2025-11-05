using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce_Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAttributeDefinition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValue_AttributeDefinitions_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "ProductAttributeValue");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValue_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValue");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValue_Products_ProductId",
                schema: "ecom",
                table: "ProductAttributeValue");

            migrationBuilder.DropForeignKey(
                name: "FK_SkuOptionValue_AttributeDefinitions_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "SkuOptionValue");

            migrationBuilder.DropForeignKey(
                name: "FK_SkuOptionValue_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "SkuOptionValue");

            migrationBuilder.DropForeignKey(
                name: "FK_SkuOptionValue_ProductSkus_SkuId",
                schema: "ecom",
                table: "SkuOptionValue");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SkuOptionValue",
                schema: "ecom",
                table: "SkuOptionValue");

            migrationBuilder.DropIndex(
                name: "IX_SkuOptionValue_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "SkuOptionValue");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductAttributeValue",
                schema: "ecom",
                table: "ProductAttributeValue");

            migrationBuilder.DropIndex(
                name: "IX_ProductAttributeValue_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "ProductAttributeValue");

            migrationBuilder.DropColumn(
                name: "AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "SkuOptionValue");

            migrationBuilder.DropColumn(
                name: "AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "ProductAttributeValue");

            migrationBuilder.RenameTable(
                name: "SkuOptionValue",
                schema: "ecom",
                newName: "SkuOptionValues",
                newSchema: "ecom");

            migrationBuilder.RenameTable(
                name: "ProductAttributeValue",
                schema: "ecom",
                newName: "ProductAttributeValues",
                newSchema: "ecom");

            migrationBuilder.RenameIndex(
                name: "IX_SkuOptionValue_AttributeId",
                schema: "ecom",
                table: "SkuOptionValues",
                newName: "IX_SkuOptionValues_AttributeId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductAttributeValue_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "IX_ProductAttributeValues_AttributeId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<byte>(
                name: "DataType",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "tinyint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFilterable",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVariant",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SkuOptionValues",
                schema: "ecom",
                table: "SkuOptionValues",
                columns: new[] { "SkuId", "AttributeId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductAttributeValues",
                schema: "ecom",
                table: "ProductAttributeValues",
                columns: new[] { "ProductId", "AttributeId" });

            migrationBuilder.CreateIndex(
                name: "IX_AttributeDefinitions_Name",
                schema: "ecom",
                table: "AttributeDefinitions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AttributeDefinitions_Slug",
                schema: "ecom",
                table: "AttributeDefinitions",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValues_ProductId",
                schema: "ecom",
                table: "ProductAttributeValues",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValues_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValues",
                column: "AttributeId",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValues_Products_ProductId",
                schema: "ecom",
                table: "ProductAttributeValues",
                column: "ProductId",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SkuOptionValues_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "SkuOptionValues",
                column: "AttributeId",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SkuOptionValues_ProductSkus_SkuId",
                schema: "ecom",
                table: "SkuOptionValues",
                column: "SkuId",
                principalSchema: "ecom",
                principalTable: "ProductSkus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValues_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValues_Products_ProductId",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropForeignKey(
                name: "FK_SkuOptionValues_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "SkuOptionValues");

            migrationBuilder.DropForeignKey(
                name: "FK_SkuOptionValues_ProductSkus_SkuId",
                schema: "ecom",
                table: "SkuOptionValues");

            migrationBuilder.DropIndex(
                name: "IX_AttributeDefinitions_Name",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_AttributeDefinitions_Slug",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SkuOptionValues",
                schema: "ecom",
                table: "SkuOptionValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductAttributeValues",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropIndex(
                name: "IX_ProductAttributeValues_ProductId",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropColumn(
                name: "IsFilterable",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropColumn(
                name: "IsVariant",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropColumn(
                name: "Slug",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.DropColumn(
                name: "Unit",
                schema: "ecom",
                table: "AttributeDefinitions");

            migrationBuilder.RenameTable(
                name: "SkuOptionValues",
                schema: "ecom",
                newName: "SkuOptionValue",
                newSchema: "ecom");

            migrationBuilder.RenameTable(
                name: "ProductAttributeValues",
                schema: "ecom",
                newName: "ProductAttributeValue",
                newSchema: "ecom");

            migrationBuilder.RenameIndex(
                name: "IX_SkuOptionValues_AttributeId",
                schema: "ecom",
                table: "SkuOptionValue",
                newName: "IX_SkuOptionValue_AttributeId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductAttributeValues_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValue",
                newName: "IX_ProductAttributeValue_AttributeId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "DataType",
                schema: "ecom",
                table: "AttributeDefinitions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "tinyint");

            migrationBuilder.AddColumn<int>(
                name: "AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "SkuOptionValue",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "ProductAttributeValue",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SkuOptionValue",
                schema: "ecom",
                table: "SkuOptionValue",
                columns: new[] { "SkuId", "AttributeId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductAttributeValue",
                schema: "ecom",
                table: "ProductAttributeValue",
                columns: new[] { "ProductId", "AttributeId" });

            migrationBuilder.CreateIndex(
                name: "IX_SkuOptionValue_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "SkuOptionValue",
                column: "AttributeDefinitionAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValue_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "ProductAttributeValue",
                column: "AttributeDefinitionAttributeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValue_AttributeDefinitions_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "ProductAttributeValue",
                column: "AttributeDefinitionAttributeId",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValue_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValue",
                column: "AttributeId",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValue_Products_ProductId",
                schema: "ecom",
                table: "ProductAttributeValue",
                column: "ProductId",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SkuOptionValue_AttributeDefinitions_AttributeDefinitionAttributeId",
                schema: "ecom",
                table: "SkuOptionValue",
                column: "AttributeDefinitionAttributeId",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SkuOptionValue_AttributeDefinitions_AttributeId",
                schema: "ecom",
                table: "SkuOptionValue",
                column: "AttributeId",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SkuOptionValue_ProductSkus_SkuId",
                schema: "ecom",
                table: "SkuOptionValue",
                column: "SkuId",
                principalSchema: "ecom",
                principalTable: "ProductSkus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
