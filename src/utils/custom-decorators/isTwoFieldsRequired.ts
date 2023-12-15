import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from "class-validator";
  
  @ValidatorConstraint({ async: false })
  export class TwoFieldValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const relatedValue = (args.object as any)[relatedPropertyName];
      return (value && relatedValue) || (!value && !relatedValue);
    }
  
    defaultMessage(args: ValidationArguments) {
      return `Both '${args.property}' and '${args.constraints[0]}' must be given or both must be not given.`;
    }
  }
  
  export function IsTwoFieldsRequired(
    propertyName: string,
    relatedPropertyName: string,
    validationOptions?: ValidationOptions
  ) {
    return function (object: Record<string, any>, propertyName: string) {
      registerDecorator({
        name: "isTwoFieldsRequired",
        target: object.constructor,
        propertyName,
        constraints: [relatedPropertyName],
        options: validationOptions,
        validator: TwoFieldValidator,
      });
    };
  }
  