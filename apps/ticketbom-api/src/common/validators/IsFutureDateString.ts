import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDateString', async: false })
export class IsFutureDateString implements ValidatorConstraintInterface {
  validate(dateString: string, _args: ValidationArguments): boolean {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return false; // Invalid date
    }
    return date > new Date();
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Date must be in the future';
  }
}
