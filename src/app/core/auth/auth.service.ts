import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export  class  AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  get isLoggedIn(): boolean {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    return user !== null;
  }

  login(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        tap(data => localStorage.setItem('user', JSON.stringify(data.user)))
      );
  }

  register(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        tap(data => localStorage.setItem('user', JSON.stringify(data.user)))
      );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut())
      .pipe(
        tap(() => localStorage.removeItem('user'))
      );
  }

  loginWithGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))
      .pipe(
        tap(data => localStorage.setItem('user', JSON.stringify(data.user)))
      );
  }
}
