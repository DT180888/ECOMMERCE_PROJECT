using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce_Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_Category_ParentId",
                schema: "ecom",
                table: "Category");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategories_Category_CategoryId",
                schema: "ecom",
                table: "ProductCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_PromotionCategories_Category_CategoryId",
                schema: "ecom",
                table: "PromotionCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Category",
                schema: "ecom",
                table: "Category");

            migrationBuilder.RenameTable(
                name: "Category",
                schema: "ecom",
                newName: "Categories",
                newSchema: "ecom");

            migrationBuilder.RenameIndex(
                name: "IX_Category_ParentId",
                schema: "ecom",
                table: "Categories",
                newName: "IX_Categories_ParentId");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "Categories",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "ecom",
                table: "Categories");

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "ecom",
                table: "Categories",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "Categories",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "Categories",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "Categories",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                schema: "ecom",
                table: "Categories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                schema: "ecom",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                schema: "ecom",
                table: "Categories",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentId",
                schema: "ecom",
                table: "Categories",
                column: "ParentId",
                principalSchema: "ecom",
                principalTable: "Categories",
                principalColumn: "CategoryId",
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
                name: "FK_PromotionCategories_Categories_CategoryId",
                schema: "ecom",
                table: "PromotionCategories",
                column: "CategoryId",
                principalSchema: "ecom",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentId",
                schema: "ecom",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCategories_Categories_CategoryId",
                schema: "ecom",
                table: "ProductCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_PromotionCategories_Categories_CategoryId",
                schema: "ecom",
                table: "PromotionCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                schema: "ecom",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Name",
                schema: "ecom",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Slug",
                schema: "ecom",
                table: "Categories");

            migrationBuilder.RenameTable(
                name: "Categories",
                schema: "ecom",
                newName: "Category",
                newSchema: "ecom");

            migrationBuilder.RenameIndex(
                name: "IX_Categories_ParentId",
                schema: "ecom",
                table: "Category",
                newName: "IX_Category_ParentId");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "ecom",
                table: "Category",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<byte[]>(
                name: "RowVersion",
                schema: "ecom",
                table: "Category",
                type: "varbinary(max)",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "rowversion",
                oldRowVersion: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "ecom",
                table: "Category",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "ecom",
                table: "Category",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "ecom",
                table: "Category",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Category",
                schema: "ecom",
                table: "Category",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_Category_ParentId",
                schema: "ecom",
                table: "Category",
                column: "ParentId",
                principalSchema: "ecom",
                principalTable: "Category",
                principalColumn: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCategories_Category_CategoryId",
                schema: "ecom",
                table: "ProductCategories",
                column: "CategoryId",
                principalSchema: "ecom",
                principalTable: "Category",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionCategories_Category_CategoryId",
                schema: "ecom",
                table: "PromotionCategories",
                column: "CategoryId",
                principalSchema: "ecom",
                principalTable: "Category",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
