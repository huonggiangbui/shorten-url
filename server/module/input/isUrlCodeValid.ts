import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsUrlCodeValidConstraint
  implements ValidatorConstraintInterface {
  validate(urlCode: string) {
    let urlCodeRegEx = /^[a-zA-Z0-9_-]{4,20}$/;

    return urlCodeRegEx.test(urlCode);
  }
}

export function IsUrlCodeValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlCodeValidConstraint
    });
  };
}