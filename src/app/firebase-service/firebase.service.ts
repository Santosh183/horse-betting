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
  editUser(id: any, updatedRecord: any) {
    return this.firestore.doc('users/' + id).update(updatedRecord);
  }

  /* **************** race methods ******************* */
  getRaces() {
    return this.firestore.collection('races').snapshotChanges();
  }
  getRace(id: any) {
    return this.firestore.doc('races/' + id).snapshotChanges();
  }

  /* **************** entry methods ******************* */
  getRaceEntries(id: any) {
    return this.firestore.doc('races/' + id).collection('raceEntries').snapshotChanges();
  }
  getEntryDetails(raceId: any, entryId: any) {
    return this.firestore.doc('races/' + raceId).collection('raceEntries').doc(entryId).snapshotChanges();
  }
  addEntry(raceId: any, entry: any) {
    return this.firestore.doc('races/' + raceId).collection('raceEntries').add(entry);
  }
  deleteEntry(raceId: any, entryId: any) {
    return this.firestore.doc('races/' + raceId).collection('raceEntries').doc(entryId).delete();
  }
  editEntry(raceId: any, entryId: any, entry: any) {
    return this.firestore.doc('races/' + raceId).collection('raceEntries').doc(entryId).update(entry);
  }
}
