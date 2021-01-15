import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Task, taskPriorities, TaskType, TaskPriority, TasksService, taskTypes } from 'src/app/core/http/tasks/tasks.service';
import { CreateTaskDialogComponent } from '../../components/create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss']
})
export class TaskPageComponent implements OnInit {
  public task: Task | null = null;
  public type: TaskType | null = null;
  public priority: TaskPriority | null = null;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private tasksService: TasksService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.tasksService.getTaskById(params.get('id') as string))
    ).subscribe({
      next: data => {
        if (!data) {
          this.task = null;
          this.type = null;
          this.priority = null;
        }
        else {
          this.task = data;
          this.type = this.getType(data.type) as TaskType;
          this.priority = this.getPriority(data.priority) as TaskPriority;
        }
      },
      error: err => {
        console.error(err);
        this.task = null;
        this.type = null;
        this.priority = null;
      }
    });
  }

  handleDelete(): void {
    if (this.task) {
      this.tasksService.deleteTask(this.task.id).subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: err => {
          console.error(err);
        }
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '900px',
      data: {
        ...this.task
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.updateTask(result).subscribe({
          error: err => console.log(err)
        });
      }
    });
  }

  getPriority(priority: string): TaskPriority | undefined {
    return taskPriorities.find(p => p.priority === priority);
  }

  getType(type: string): TaskType | undefined {
    return taskTypes.find(t => t.type === type);
  }
}
