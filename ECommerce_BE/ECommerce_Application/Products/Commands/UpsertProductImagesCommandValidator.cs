using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed class UpsertProductImagesCommandValidator : AbstractValidator<UpsertProductImagesCommand>
    {
        public UpsertProductImagesCommandValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0);
            RuleFor(x => x.Images).NotEmpty();

            RuleForEach(x => x.Images).ChildRules(img =>
            {
                img.RuleFor(i => i.Url).NotEmpty();
                img.RuleFor(i => i.SortOrder).GreaterThanOrEqualTo(0);
            });

            // Không cho quá 1 ảnh primary từ phía request (Handler vẫn chuẩn hoá lần cuối)
            RuleFor(x => x.Images)
                .Must(list => list.Count(i => i.IsPrimary) <= 1)
                .WithMessage("Only one primary image is allowed.");
        }
    }
}
