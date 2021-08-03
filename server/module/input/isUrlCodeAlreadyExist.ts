import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import { Link } from "../../entity/Link";

@ValidatorConstraint({ async: true })
export class IsUrlCodeAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(urlCode: string) {
    return Link.findOne({ where: { urlCode } }).then(url => {
      if (url) return false;
      return true;
    });
  }
}

export function IsUrlCodeAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlCodeAlreadyExistConstraint
    });
  };
}