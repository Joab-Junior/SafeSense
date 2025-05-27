import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }

        const errors: ValidationErrors = {};

        if (value.length < 6) {
            errors['minlength'] = 'A senha deve ter no mínimo 6 caracteres!';
        }
        if (!/[A-Z]/.test(value)) {
            errors['uppercase'] = 'A senha deve conter pelo menos uma letra maiúscula!';
        }
        if (!/[a-z]/.test(value)) {
            errors['lowercase'] = 'A senha deve conter pelo menos uma letra minúscola!';
        }
        if (!/[0-9]/.test(value)) {
            errors['digit'] = 'A senha deve conter pelo menos um número';
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
            errors['special'] = 'A senha deve conter pelo menos um caractere especial!';
        }

        return Object.keys(errors).length ? errors : null;
    };
}