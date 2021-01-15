import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    DragDropModule,
    TextFieldModule,
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    MatDividerModule
  ]
})
export class DashboardModule { }
