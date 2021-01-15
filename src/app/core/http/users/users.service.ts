import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}

@Injectable()
export class UsersService {
  constructor(private afs: AngularFirestore) { }

  updateUser(user: firebase.User): Observable<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.email}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null
    };
    return from(userRef.set(data, { merge: true }));
  }

  getUserByEmail(email: string | null): Observable<User | undefined> {
    if (!email) {
      return of(undefined);
    }
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${email}`);
    return userRef.valueChanges();
  }

  getUsers(search: string, limit: number): Observable<User[]> {
    return this.afs.collection<User>('users', ref => ref
      .orderBy('email')
      .startAt(search)
      .endAt(search + '\uf8ff')
      .limit(limit)
    ).valueChanges();
  }
}
