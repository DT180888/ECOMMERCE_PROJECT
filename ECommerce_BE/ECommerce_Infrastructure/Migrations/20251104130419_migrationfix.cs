using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce_Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class migrationFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                schema: "ecom",
                table: "Categories",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentId",
                schema: "ecom",
                table: "Categories",
                column: "ParentId",
                principalSchema: "ecom",
                principalTable: "Categories",
                principalColumn: "CategoryId");

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
    }
}
