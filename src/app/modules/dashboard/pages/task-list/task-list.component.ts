import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task, TasksService, taskStates } from 'src/app/core/http/tasks/tasks.service';

import { CreateTaskDialogComponent } from '../../components/create-task-dialog/create-task-dialog.component';

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
  public columns: Column[] = [];
  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService
  ) { }

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe({
      next: data => {
        this.columns = taskStates.map(status => ({
          name: status,
          tasks: data.filter(task => task.status === status)
        }));
      }
    });
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

      this.tasksService.updateTask({
      ...event.container.data[event.currentIndex],
      status: newCol.name
      });
    }
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
}
