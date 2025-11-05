using ECommerce_Domain.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Infrastructure.Configurations
{
    public class PromotionConfig : IEntityTypeConfiguration<Promotion>
    {
        public void Configure(EntityTypeBuilder<Promotion> b)
        {
            b.ToTable("Promotions", "ecom");
            b.HasKey(x => x.PromotionId);

            b.HasIndex(x => x.Code).IsUnique().HasFilter("[Code] IS NOT NULL");
            b.HasIndex(x => new { x.IsActive, x.StartsAt, x.EndsAt });
        }
    }

}
