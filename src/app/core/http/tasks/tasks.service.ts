import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { TaskFormData } from 'src/app/modules/dashboard/components/create-task-dialog/create-task-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { User, UsersService } from '../users/users.service';
import { Filters } from 'src/app/modules/dashboard/components/filter-dialog/filter-dialog.component';

export interface Task {
  id: string;
  title: string;
  estimate: number | null;
  type: string;
  status: string;
  priority: string;
  description: string;
  assignee: User | null;
  reporter: User | null;
  labels: string[];
  dueDate: string | null;
  createdDate: string;
  updatedDate: string | null;
}

export interface TaskType {
  type: string;
  iconUrl: string;
  displayName: string;
}

export interface TaskPriority {
  priority: string;
  iconUrl: string;
  displayName: string;
}

export const taskTypes: TaskType[] = [
  {
    type: 'task',
    iconUrl: 'assets/images/task-types/task.svg',
    displayName: 'Task'
  },
  {
    type: 'user-story',
    iconUrl: 'assets/images/task-types/user-story.svg',
    displayName: 'User story'
  },
  {
    type: 'bug',
    iconUrl: 'assets/images/task-types/bug.svg',
    displayName: 'Bug'
  },
  {
    type: 'epic',
    iconUrl: 'assets/images/task-types/epic.svg',
    displayName: 'Epic'
  },
  {
    type: 'feature',
    iconUrl: 'assets/images/task-types/feature.svg',
    displayName: 'Feature'
  }
];

export const taskPriorities: TaskPriority[] = [
  {
    priority: 'major',
    iconUrl: 'assets/images/task-priorities/major.svg',
    displayName: 'Major'
  },
  {
    priority: 'blocker',
    iconUrl: 'assets/images/task-priorities/blocker.svg',
    displayName: 'Blocker'
  },
  {
    priority: 'critical',
    iconUrl: 'assets/images/task-priorities/critical.svg',
    displayName: 'Critical'
  },
  {
    priority: 'minor',
    iconUrl: 'assets/images/task-priorities/minor.svg',
    displayName: 'Minor'
  },
  {
    priority: 'trivial',
    iconUrl: 'assets/images/task-priorities/trivial.svg',
    displayName: 'Trivial'
  }
];

export const taskStates: string[] = [
  'To Do',
  'In Progress',
  'Done'
];

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.afs.doc<Task>(`tasks/${id}`).valueChanges();
  }

  getTasks(filters: Filters): Observable<Task[]> {
    return this.afs.collection<Task>('tasks', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (filters.label) { query = query.where('labels', 'array-contains', filters.label); }
      if (filters.assignee) { query = query.where('assignee.email', '==', filters.assignee); }
      if (filters.reporter) { query = query.where('reporter.email', '==', filters.reporter); }
      if (filters.from) { query = query.where('createdDate', '>=', filters.from); }
      if (filters.to) { query = query.where('createdDate', '<=', filters.to); }
      return query;
    }).valueChanges();
  }

  updateTaskState(task: Task): Observable<void> {
    const taskRef: AngularFirestoreDocument<Task> = this.afs.doc(`tasks/${task.id}`);
    return from(taskRef.set(task, { merge: true }));
  }

  updateTask(formData: TaskFormData): Observable<void> {
    const taskRef: AngularFirestoreDocument<Task> = this.afs.doc(`tasks/${formData.id}`);
    const data = {
      ...formData,
      updatedDate: (new Date()).toISOString()
    };

    return from(taskRef.set(data as Task, { merge: true }));
  }

  deleteTask(id: string): Observable<void> {
    const taskRef = this.afs.doc(`tasks/${id}`);

    return from(taskRef.delete());
  }

  createTask(formData: TaskFormData): Observable<void> {
    const id = this.afs.createId();
    const taskRef = this.afs.doc(`tasks/${id}`);

    const data: Task = {
      ...formData,
      id,
      reporter: null,
      createdDate: (new Date()).toISOString(),
      updatedDate: null,
      status: taskStates[0]
    };

    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          throw({message: 'Not authorized'});
        }
        return this.usersService.getUserByEmail(user.email);
      }),
      switchMap(reporter => {
        data.reporter = reporter as User;
        return taskRef.set(data as Task);
      })
    );
  }
}
