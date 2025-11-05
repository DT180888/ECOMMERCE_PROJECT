using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce_Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_Full_Promotion_Relationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Coupons_PromotionId",
                schema: "ecom",
                table: "Coupons");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "ecom",
                table: "Promotions",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BrandId",
                schema: "ecom",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppliedCouponCode",
                schema: "ecom",
                table: "Orders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppliedPromotionCode",
                schema: "ecom",
                table: "Orders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "ecom",
                table: "Coupons",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "CouponRedemptions",
                schema: "ecom",
                columns: table => new
                {
                    CouponId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RedeemedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "sysutcdatetime()"),
                    DiscountMinor = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CouponRedemptions", x => new { x.CouponId, x.UserId });
                    table.ForeignKey(
                        name: "FK_CouponRedemptions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dbo",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CouponRedemptions_Coupons_CouponId",
                        column: x => x.CouponId,
                        principalSchema: "ecom",
                        principalTable: "Coupons",
                        principalColumn: "CouponId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderPromotions",
                schema: "ecom",
                columns: table => new
                {
                    OrderId = table.Column<long>(type: "bigint", nullable: false),
                    PromotionId = table.Column<int>(type: "int", nullable: false),
                    DiscountMinor = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderPromotions", x => new { x.OrderId, x.PromotionId });
                    table.ForeignKey(
                        name: "FK_OrderPromotions_Orders_OrderId",
                        column: x => x.OrderId,
                        principalSchema: "ecom",
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderPromotions_Promotions_PromotionId",
                        column: x => x.PromotionId,
                        principalSchema: "ecom",
                        principalTable: "Promotions",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PromotionCategories",
                schema: "ecom",
                columns: table => new
                {
                    PromotionId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionCategories", x => new { x.PromotionId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_PromotionCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "ecom",
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromotionCategories_Promotions_PromotionId",
                        column: x => x.PromotionId,
                        principalSchema: "ecom",
                        principalTable: "Promotions",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PromotionProducts",
                schema: "ecom",
                columns: table => new
                {
                    PromotionId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionProducts", x => new { x.PromotionId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_PromotionProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "ecom",
                        principalTable: "Products",
                        principalColumn: "ProductID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromotionProducts_Promotions_PromotionId",
                        column: x => x.PromotionId,
                        principalSchema: "ecom",
                        principalTable: "Promotions",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_Code",
                schema: "ecom",
                table: "Promotions",
                column: "Code",
                unique: true,
                filter: "[Code] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_IsActive_StartsAt_EndsAt",
                schema: "ecom",
                table: "Promotions",
                columns: new[] { "IsActive", "StartsAt", "EndsAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_BrandId",
                schema: "ecom",
                table: "Products",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_PromotionId_Code",
                schema: "ecom",
                table: "Coupons",
                columns: new[] { "PromotionId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CouponRedemptions_UserId",
                schema: "ecom",
                table: "CouponRedemptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPromotions_PromotionId",
                schema: "ecom",
                table: "OrderPromotions",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionCategories_CategoryId",
                schema: "ecom",
                table: "PromotionCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionProducts_ProductId",
                schema: "ecom",
                table: "PromotionProducts",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Brands_BrandId",
                schema: "ecom",
                table: "Products",
                column: "BrandId",
                principalSchema: "ecom",
                principalTable: "Brands",
                principalColumn: "BrandId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Brands_BrandId",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropTable(
                name: "CouponRedemptions",
                schema: "ecom");

            migrationBuilder.DropTable(
                name: "OrderPromotions",
                schema: "ecom");

            migrationBuilder.DropTable(
                name: "PromotionCategories",
                schema: "ecom");

            migrationBuilder.DropTable(
                name: "PromotionProducts",
                schema: "ecom");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_Code",
                schema: "ecom",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_IsActive_StartsAt_EndsAt",
                schema: "ecom",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_Products_BrandId",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Coupons_PromotionId_Code",
                schema: "ecom",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "BrandId",
                schema: "ecom",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "AppliedCouponCode",
                schema: "ecom",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "AppliedPromotionCode",
                schema: "ecom",
                table: "Orders");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "ecom",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "ecom",
                table: "Coupons",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_PromotionId",
                schema: "ecom",
                table: "Coupons",
                column: "PromotionId");
        }
    }
}
