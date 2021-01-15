import { AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export function dateRangeValidator(control: AbstractControl): {[key: string]: any} | null {
    const from = control.get('from')?.value;
    const to = control.get('to')?.value;

    let isValid = true;
    if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        isValid = fromDate <= toDate;
    }

    return !isValid ? {dataRange: '"From" should be lesser then or equal to "To"'} : null;
}

export class DateRangeErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control?.touched && form?.hasError('dataRange') ? true : false;
    }
}

