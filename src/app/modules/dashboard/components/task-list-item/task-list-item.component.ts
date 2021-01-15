import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/core/http/tasks/tasks.service';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss']
})
export class TaskListItemComponent implements OnInit {
  @Input() task: Task | null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
