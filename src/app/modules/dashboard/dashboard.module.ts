import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskPageComponent } from './pages/task-page/task-page.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { CreateTaskDialogComponent } from './components/create-task-dialog/create-task-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TaskListComponent,
    TaskPageComponent,
    TaskListItemComponent,
    FilterDialogComponent,
    CreateTaskDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    MatDividerModule
  ]
})
export class DashboardModule { }
