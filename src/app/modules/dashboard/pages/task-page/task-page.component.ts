import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Task, taskPriorities, TaskType, TaskPriority, TasksService, taskTypes } from 'src/app/core/http/tasks/tasks.service';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss']
})
export class TaskPageComponent implements OnInit {
  public task: Task | null = null;
  public type: TaskType | null = null;
  public priority: TaskPriority | null = null;

  constructor(private tasksService: TasksService, private route: ActivatedRoute) { }

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

  getPriority(priority: string): TaskPriority | undefined {
    return taskPriorities.find(p => p.priority === priority);
  }

  getType(type: string): TaskType | undefined {
    return taskTypes.find(t => t.type === type);
  }
}
