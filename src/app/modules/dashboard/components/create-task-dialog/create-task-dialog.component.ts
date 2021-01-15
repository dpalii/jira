import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { User, UsersService } from 'src/app/core/http/users/users.service';
import { taskPriorities, TaskPriority, TaskType, taskTypes } from 'src/app/core/http/tasks/tasks.service';

export interface TaskFormData {
  title: string;
  estimate: number | null;
  type: string;
  priority: string;
  description: string;
  assignee: string | null;
  labels: string[];
  dueDate: string | null;
}

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent implements OnInit {
  private timeoutRef: number | null = null;
  public form: FormGroup;
  public users: User[] = [];
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public readonly taskTypes = taskTypes;
  public readonly taskPriorities = taskPriorities;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private usersService: UsersService,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    this.form = this.fb.group({
      title: [(data && data.title) || '', Validators.required],
      estimate: [(data && data.estimate) || null, Validators.min(0)],
      type: [(data && data.type) || 'task', Validators.required],
      priority: [(data && data.priority) || 'major', Validators.required],
      description: [(data && data.description) || ''],
      assignee: [(data && data.assignee) || ''],
      labels: [(data && data.labels) || []],
      dueDate: [(data && data.dueDate) || null]
    });
  }

  ngOnInit(): void {
    this.getUsers('');
  }

  get controls(): {[key: string]: AbstractControl} {
    return this.form.controls;
  }

  getType(type: string): TaskType | undefined {
    return taskTypes.find(item => item.type === type);
  }

  getPriority(type: string): TaskPriority | undefined {
    return taskPriorities.find(item => item.priority === type);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();
    const controlValue = this.controls.labels.value;

    if (value && !controlValue.includes(value)) {
      this.controls.labels.setValue([
        ...controlValue,
        value
      ]);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(label: string): void {
    const controlValue = this.controls.labels.value;
    this.controls.labels.setValue(controlValue.filter((curr: string) => curr !== label));
  }

  handleTypingPause(event: any): void {
    const input = event.target.value;
    this.controls.assignee.setErrors(null);

    if (this.timeoutRef) {
      window.clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
    this.timeoutRef = window.setTimeout(() => {
      this.getUsers(input);
    }, 500);
  }

  handleFocus(event: any): void {
    this.users = [];
    const input = event.target.value;
    this.getUsers(input);
  }

  handleConfirm(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      if (formData.assignee) {
        this.usersService.getUserByEmail(formData.assignee).subscribe(user => {
          if (user) {
            this.dialogRef.close(formData);
          }
          else {
            this.controls.assignee.setErrors({emailNotFound: true});
          }
        });
      }
      else {
        this.dialogRef.close(formData);
      }
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
