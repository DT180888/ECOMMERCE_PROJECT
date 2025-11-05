using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Attributes.Commands
{
    public sealed record DeleteAttributeCommand(int AttributeId) : IRequest;

    public sealed class DeleteAttributeCommandHandler(IApplicationDbContext db)
        : IRequestHandler<DeleteAttributeCommand>
    {
        public async Task Handle(DeleteAttributeCommand c, CancellationToken ct)
        {
            var e = await db.AttributeDefinitions.FirstOrDefaultAsync(x => x.AttributeId == c.AttributeId && !x.IsDeleted, ct);
            if (e is null) return;

            // Chặn xoá nếu đang được dùng ở ProductAttributeValues
            var inUse = await db.ProductAttributeValues.AnyAsync(x => x.AttributeId == c.AttributeId, ct);
            if (inUse) throw new InvalidOperationException("Cannot delete attribute: it's in use by products.");

            e.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
