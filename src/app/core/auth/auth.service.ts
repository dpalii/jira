import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User, UsersService } from '../http/users/users.service';

@Injectable()
export  class  AuthService {
  user$: Observable<firebase.User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private usersService: UsersService
  ) {
    this.user$ = this.afAuth.authState;
  }

  get isLoggedIn(): boolean {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    return user !== null;
  }

  login(email: string, password: string): Observable<void> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        tap(data => {
          if (data.user === null) {
            throw({message: 'Couldn\'t log in'});
          }
          localStorage.setItem('user', JSON.stringify(data.user));
        }),
        switchMap(data => this.usersService.updateUser(data.user as firebase.User))
      );
  }

  register(email: string, password: string): Observable<void> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        tap(data => localStorage.setItem('user', JSON.stringify(data.user))),
        switchMap(data => this.usersService.updateUser(data.user as firebase.User))
      );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut())
      .pipe(
        tap(() => localStorage.removeItem('user'))
      );
  }

  loginWithGoogle(): Observable<void> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))
      .pipe(
        tap(data => {
          if (data.user === null) {
            throw({message: 'Couldn\'t log in'});
          }
          localStorage.setItem('user', JSON.stringify(data.user));
        }),
        switchMap(data => this.usersService.updateUser(data.user as firebase.User))
      );
  }
}
