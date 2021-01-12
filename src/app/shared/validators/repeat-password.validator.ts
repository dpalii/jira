import { AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export function repeatPasswordValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return (password && password !== repeatPassword) ? {repeatPassword: 'Passwords do not match'} : null;
}

export class RepeatPasswordErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control?.touched && form?.hasError('repeatPassword') ? true : false;
    }
}

