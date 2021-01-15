import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UsersService } from 'src/app/core/http/users/users.service';
import { DateRangeErrorMatcher, dateRangeValidator } from 'src/app/shared/validators/date-range.validator';

export interface Filters {
  label: string | null;
  assignee: string | null;
  reporter: string | null;
  from: string | null;
  to: string | null;
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  private timeoutRef: number | null = null;
  public form: FormGroup;
  public matcher = new DateRangeErrorMatcher();
  public users: User[] = [];

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Filters
  ) {
    this.form = this.fb.group({
      label: [data?.label || ''],
      assignee: [data?.assignee || ''],
      reporter: [data?.reporter || ''],
      from: [data?.from ? data.from.slice(0, 10) : null],
      to: [data?.to ? data.to.slice(0, 10) : null]
    }, {
      validators: dateRangeValidator
    });
  }

  ngOnInit(): void {
    this.getUsers('');
  }

  get controls(): {[key: string]: AbstractControl} {
    return this.form.controls;
  }

  handleTypingPause(event: any, controlName: string): void {
    const input = event.target.value;
    const control = this.controls[controlName];
    control.setErrors(null);

    if (this.timeoutRef) {
      window.clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
    this.timeoutRef = window.setTimeout(() => {
      this.getUsers(input);
    }, 250);
  }

  handleFocus(event: any): void {
    this.users = [];

    this.timeoutRef = window.setTimeout(() => {
      const input = event.target.value;
      this.getUsers(input);
    }, 500);
  }

  handleFocusOut(event: any): void {
    if (this.timeoutRef) {
      window.clearTimeout(this.timeoutRef);
    }
  }

  handleConfirm(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      this.dialogRef.close({
        ...formData,
        from: formData.from ? (new Date(formData.from)).toISOString() : formData.from,
        to: formData.to ? (new Date(formData.to)).toISOString() : formData.to
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  private getUsers(search: string): void {
    const limit = 5;

    this.usersService.getUsers(search, limit).subscribe({
      next: data => this.users = data,
      error: err => {
        console.error(err);
        this.users = [];
      }
    });
  }
}
