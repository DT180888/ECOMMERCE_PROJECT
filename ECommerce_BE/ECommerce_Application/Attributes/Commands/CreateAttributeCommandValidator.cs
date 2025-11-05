using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Attributes.Commands
{
    public sealed class CreateAttributeCommandValidator : AbstractValidator<CreateAttributeCommand>
    {
        public CreateAttributeCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Slug).NotEmpty().MaximumLength(200);
            RuleFor(x => x.DataType).IsInEnum().When(_ => false); // nếu dùng enum thực sự
                                                                  // hoặc: RuleFor(x => x.DataType).InclusiveBetween(0, 10); // nếu là byte
            RuleFor(x => x.Unit).MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.Unit));
        }
    }
}
