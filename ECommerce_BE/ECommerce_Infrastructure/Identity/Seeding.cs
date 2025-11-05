using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ECommerce_Infrastructure.Persistence;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Identity
{
    public static class Seeding
    {
        public static async Task SeedAsync(IServiceProvider sp)
        {
            using var scope = sp.CreateScope();
            var services = scope.ServiceProvider;

            var db = services.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();

            var roleMgr = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userMgr = services.GetRequiredService<UserManager<IdentityUser>>();

            // 1️⃣ Seed roles
            string[] roles = ["Admin", "Staff", "Customer"];
            foreach (var r in roles)
            {
                if (!await roleMgr.RoleExistsAsync(r))
                {
                    await roleMgr.CreateAsync(new IdentityRole(r));
                    Console.WriteLine($"✅ Created role: {r}");
                }
            }

            // 2️⃣ Seed Admin account
            var adminEmail = "admin@shop.local";
            var admin = await userMgr.FindByEmailAsync(adminEmail);
            if (admin is null)
            {
                admin = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };
                var result = await userMgr.CreateAsync(admin, "Admin@12345");
                if (result.Succeeded)
                    Console.WriteLine($"✅ Created admin: {adminEmail}");
                else
                    Console.WriteLine($"⚠️ Failed to create admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            if (!await userMgr.IsInRoleAsync(admin, "Admin"))
                await userMgr.AddToRoleAsync(admin, "Admin");

            // 3️⃣ Seed Staff account
            var staffEmail = "staff@shop.local";
            var staff = await userMgr.FindByEmailAsync(staffEmail);
            if (staff is null)
            {
                staff = new IdentityUser
                {
                    UserName = staffEmail,
                    Email = staffEmail,
                    EmailConfirmed = true
                };
                var result = await userMgr.CreateAsync(staff, "Staff@12345");
                if (result.Succeeded)
                    Console.WriteLine($"✅ Created staff: {staffEmail}");
                else
                    Console.WriteLine($"⚠️ Failed to create staff: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            if (!await userMgr.IsInRoleAsync(staff, "Staff"))
                await userMgr.AddToRoleAsync(staff, "Staff");

            // 4️⃣ Seed sample Brands (tuỳ chọn)
            if (!await db.Brands.AnyAsync())
            {
                db.Brands.AddRange(
                    new Brand { Name = "Nike", Slug = "nike" },
                    new Brand { Name = "Adidas", Slug = "adidas" },
                    new Brand { Name = "Puma", Slug = "puma" }
                );
                await db.SaveChangesAsync();
                Console.WriteLine("✅ Seeded sample brands.");
            }

            Console.WriteLine("🎉 Database seeding completed successfully!");
        }
    }
}
