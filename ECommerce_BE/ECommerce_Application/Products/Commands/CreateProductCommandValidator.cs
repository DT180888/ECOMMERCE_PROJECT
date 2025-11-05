using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
            RuleFor(x => x.Slug).NotEmpty().MaximumLength(300);
            RuleFor(x => x.Skus).NotEmpty(); // tối thiểu 1 SKU
            RuleForEach(x => x.Skus).ChildRules(s =>
            {
                s.RuleFor(v => v.SkuCode).NotEmpty().MaximumLength(100);
                s.RuleFor(v => v.PriceMinor).GreaterThanOrEqualTo(0);
            });
            RuleForEach(x => x.Images).ChildRules(i =>
            {
                i.RuleFor(v => v.Url).NotEmpty().MaximumLength(2048);
            });
        }
    }
}
