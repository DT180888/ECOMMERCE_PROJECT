using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Categories.Commands
{
    public sealed class MoveCategoryCommandValidator : AbstractValidator<MoveCategoryCommand>
    {
        public MoveCategoryCommandValidator()
        {
            RuleFor(x => x.CategoryId).GreaterThan(0);
            // NewParentId có thể null (thành root)
        }
    }
}
