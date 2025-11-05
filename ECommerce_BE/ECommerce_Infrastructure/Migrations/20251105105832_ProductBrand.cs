using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce_Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ProductBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "FK_ProductCategories_Categories_CategoryId",
                schema: "ecom",
                table: "ProductCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategories_Products_ProductId",
                schema: "ecom",
                table: "ProductCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductImage_Products_ProductId",
                schema: "ecom",
                table: "ProductImage");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Brands_BrandId",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductSkus_Products_ProductId",
                schema: "ecom",
                table: "ProductSkus");

            migrationBuilder.DropIndex(
                name: "IX_ProductImage_ProductId_IsPrimary",
                schema: "ecom",
                table: "ProductImage");

            migrationBuilder.DropIndex(
                name: "IX_ProductImage_ProductId_SortOrder",
                schema: "ecom",
                table: "ProductImage");

            migrationBuilder.DropIndex(
                name: "IX_ProductAttributeValues_ProductId",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductCategories",
                schema: "ecom",
                table: "ProductCategories");

            migrationBuilder.RenameTable(
                name: "ProductCategories",
                schema: "ecom",
                newName: "ProductCategory",
                newSchema: "ecom");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                schema: "ecom",
                table: "ProductSkus",
                newName: "ProductID");

            migrationBuilder.RenameIndex(
                name: "IX_ProductSkus_ProductId",
                schema: "ecom",
                table: "ProductSkus",
                newName: "IX_ProductSkus_ProductID");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                schema: "ecom",
                table: "ProductImage",
                newName: "ProductID");

            migrationBuilder.RenameColumn(
                name: "AttributeId",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "AttributeID");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "ProductID");

            migrationBuilder.RenameIndex(
                name: "IX_ProductAttributeValues_AttributeId",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "IX_ProductAttributeValues_AttributeID");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                schema: "ecom",
                table: "ProductCategory",
                newName: "CategoryID");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                schema: "ecom",
                table: "ProductCategory",
                newName: "ProductID");

            migrationBuilder.RenameIndex(
                name: "IX_ProductCategories_CategoryId",
                schema: "ecom",
                table: "ProductCategory",
                newName: "IX_ProductCategory_CategoryID");

            migrationBuilder.AddColumn<long>(
                name: "ProductID1",
                schema: "ecom",
                table: "ProductSkus",
                type: "bigint",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "Products",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(220)",
                oldMaxLength: 220);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "Products",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "ecom",
                table: "Products",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "Products",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "ecom",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                schema: "ecom",
                table: "ProductImage",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(2048)",
                oldMaxLength: 2048);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "ProductImage",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "ProductImage",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "Brands",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "Brands",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "Brands",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "Brands",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "sysutcdatetime()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductCategory",
                schema: "ecom",
                table: "ProductCategory",
                columns: new[] { "ProductID", "CategoryID" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductSkus_ProductID1",
                schema: "ecom",
                table: "ProductSkus",
                column: "ProductID1");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name",
                schema: "ecom",
                table: "Products",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImage_ProductID",
                schema: "ecom",
                table: "ProductImage",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCategory_ProductID",
                schema: "ecom",
                table: "ProductCategory",
                column: "ProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValues_AttributeDefinitions_AttributeID",
                schema: "ecom",
                table: "ProductAttributeValues",
                column: "AttributeID",
                principalSchema: "ecom",
                principalTable: "AttributeDefinitions",
                principalColumn: "AttributeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributeValues_Products_ProductID",
                schema: "ecom",
                table: "ProductAttributeValues",
                column: "ProductID",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategory_Categories_CategoryID",
                schema: "ecom",
                table: "ProductCategory",
                column: "CategoryID",
                principalSchema: "ecom",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategory_Products_ProductID",
                schema: "ecom",
                table: "ProductCategory",
                column: "ProductID",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductImage_Products_ProductID",
                schema: "ecom",
                table: "ProductImage",
                column: "ProductID",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Brands_BrandId",
                schema: "ecom",
                table: "Products",
                column: "BrandId",
                principalSchema: "ecom",
                principalTable: "Brands",
                principalColumn: "BrandId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSkus_Products_ProductID",
                schema: "ecom",
                table: "ProductSkus",
                column: "ProductID",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSkus_Products_ProductID1",
                schema: "ecom",
                table: "ProductSkus",
                column: "ProductID1",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValues_AttributeDefinitions_AttributeID",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributeValues_Products_ProductID",
                schema: "ecom",
                table: "ProductAttributeValues");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategory_Categories_CategoryID",
                schema: "ecom",
                table: "ProductCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategory_Products_ProductID",
                schema: "ecom",
                table: "ProductCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductImage_Products_ProductID",
                schema: "ecom",
                table: "ProductImage");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Brands_BrandId",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductSkus_Products_ProductID",
                schema: "ecom",
                table: "ProductSkus");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductSkus_Products_ProductID1",
                schema: "ecom",
                table: "ProductSkus");

            migrationBuilder.DropIndex(
                name: "IX_ProductSkus_ProductID1",
                schema: "ecom",
                table: "ProductSkus");

            migrationBuilder.DropIndex(
                name: "IX_Products_Name",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_ProductImage_ProductID",
                schema: "ecom",
                table: "ProductImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductCategory",
                schema: "ecom",
                table: "ProductCategory");

            migrationBuilder.DropIndex(
                name: "IX_ProductCategory_ProductID",
                schema: "ecom",
                table: "ProductCategory");

            migrationBuilder.DropColumn(
                name: "ProductID1",
                schema: "ecom",
                table: "ProductSkus");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "ecom",
                table: "ProductImage");

            migrationBuilder.RenameTable(
                name: "ProductCategory",
                schema: "ecom",
                newName: "ProductCategories",
                newSchema: "ecom");

            migrationBuilder.RenameColumn(
                name: "ProductID",
                schema: "ecom",
                table: "ProductSkus",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductSkus_ProductID",
                schema: "ecom",
                table: "ProductSkus",
                newName: "IX_ProductSkus_ProductId");

            migrationBuilder.RenameColumn(
                name: "ProductID",
                schema: "ecom",
                table: "ProductImage",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "AttributeID",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "AttributeId");

            migrationBuilder.RenameColumn(
                name: "ProductID",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductAttributeValues_AttributeID",
                schema: "ecom",
                table: "ProductAttributeValues",
                newName: "IX_ProductAttributeValues_AttributeId");

            migrationBuilder.RenameColumn(
                name: "CategoryID",
                schema: "ecom",
                table: "ProductCategories",
                newName: "CategoryId");

            migrationBuilder.RenameColumn(
                name: "ProductID",
                schema: "ecom",
                table: "ProductCategories",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductCategory_CategoryID",
                schema: "ecom",
                table: "ProductCategories",
                newName: "IX_ProductCategories_CategoryId");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "Products",
                type: "nvarchar(220)",
                maxLength: 220,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "Products",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "Products",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "ecom",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "Products",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                schema: "ecom",
                table: "ProductImage",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "ProductImage",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "Brands",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "Brands",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "Brands",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "Brands",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "sysutcdatetime()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductCategories",
                schema: "ecom",
                table: "ProductCategories",
                columns: new[] { "ProductId", "CategoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductImage_ProductId_IsPrimary",
                schema: "ecom",
                table: "ProductImage",
                columns: new[] { "ProductId", "IsPrimary" },
                unique: true,
                filter: "[IsPrimary] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImage_ProductId_SortOrder",
                schema: "ecom",
                table: "ProductImage",
                columns: new[] { "ProductId", "SortOrder" });

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
                name: "FK_ProductCategories_Categories_CategoryId",
                schema: "ecom",
                table: "ProductCategories",
                column: "CategoryId",
                principalSchema: "ecom",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategories_Products_ProductId",
                schema: "ecom",
                table: "ProductCategories",
                column: "ProductId",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductImage_Products_ProductId",
                schema: "ecom",
                table: "ProductImage",
                column: "ProductId",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Brands_BrandId",
                schema: "ecom",
                table: "Products",
                column: "BrandId",
                principalSchema: "ecom",
                principalTable: "Brands",
                principalColumn: "BrandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSkus_Products_ProductId",
                schema: "ecom",
                table: "ProductSkus",
                column: "ProductId",
                principalSchema: "ecom",
                principalTable: "Products",
                principalColumn: "ProductID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
