import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Task, TasksService, taskStates } from 'src/app/core/http/tasks/tasks.service';

import { CreateTaskDialogComponent } from '../../components/create-task-dialog/create-task-dialog.component';
import { FilterDialogComponent, Filters } from '../../components/filter-dialog/filter-dialog.component';

interface Column {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  readonly taskStates = taskStates;
  private filters: Filters = {
    label: null,
    assignee: null,
    reporter: null,
    from: null,
    to: null
  };
  private taskSubscribtion: Subscription | null = null;
  public columns: Column[] = [];
  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService
  ) { }

  ngOnInit(): void {
    this.getTasks(this.filters);
  }

  getColumnData(status: string): Task[] {
    const column = this.columns.find(col => col.name === status);
    return column ? column.tasks : [];
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const newCol = this.columns.find(col => col.tasks === event.container.data) as Column;

      this.tasksService.updateTaskState({
        ...event.container.data[event.currentIndex],
        status: newCol.name
      });
    }
  }

  openFilters(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: this.filters
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filters = result;
        this.getTasks(result);
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      label: null,
      assignee: null,
      reporter: null,
      from: null,
      to: null
    };
    this.getTasks(this.filters);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.createTask(result).subscribe({
          error: err => console.log(err)
        });
      }
    });
  }

  private getTasks(filters: Filters): void {
    if (this.taskSubscribtion) {
      this.taskSubscribtion.unsubscribe();
    }
    this.taskSubscribtion = this.tasksService.getTasks(filters).subscribe({
      next: data => {
        this.columns = taskStates.map(status => ({
          name: status,
          tasks: data.filter(task => task.status === status)
        }));
      }
    });
  }
}
