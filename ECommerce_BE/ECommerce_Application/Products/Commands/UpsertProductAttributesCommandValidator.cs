using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed class UpsertProductAttributesCommandValidator : AbstractValidator<UpsertProductAttributesCommand>
    {
        public UpsertProductAttributesCommandValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0);
            RuleForEach(x => x.Attributes).ChildRules(a =>
            {
                a.RuleFor(v => v.AttributeId).GreaterThan(0);
                // Ít nhất một trong các value phải có (tuỳ policy, có thể bỏ nếu cho phép null hết)
                a.RuleFor(v => new { v.ValueText, v.ValueNumber, v.ValueBool })
                 .Must(v => v.ValueText is not null || v.ValueNumber is not null || v.ValueBool is not null)
                 .WithMessage("At least one value field must be provided.");
            });
        }
    }
}
