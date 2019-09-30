import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, ) { }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }
  addUser(user: any) {
    return this.firestore.collection('users').add(user);
  }
  getUser(id: any) {
    return this.firestore.collection('users', ref => ref.where('userNumber', '==', Number(id))).snapshotChanges();
  }
  deleteUser(id: any) {
    return this.firestore.doc('users/' + id).delete();
  }
}
