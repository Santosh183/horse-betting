import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, ) { }

  getUsers() {
    // return this.firestore.collection('users').snapshotChanges();
    return this.firestore.collection('users', ref => ref.orderBy('timestamp')).snapshotChanges();
  }
  addUser(user: any) {
    user.timestamp = new Date();
    return this.firestore.collection('users').add(user);
  }
  getUser(id: any) {
    return this.firestore.collection('users', ref => ref.where('userNumber', '==', Number(id))).snapshotChanges();
  }
  deleteUser(id: any) {
    return this.firestore.doc('users/' + id).delete();
  }
  editUser(id: any, user: any) {
    user.timestamp = new Date();
    if ( user.userBalance !== null) {
      user.userBalance = Number((user.userBalance).toFixed(2));
    }
    return this.firestore.doc('users/' + id).update(user);
  }

  /* **************** race methods ******************* */
  getRaces() {
    return this.firestore.collection('races', ref => ref.orderBy('timestamp')).snapshotChanges();
  }
  addRace(race: any) {
    race.timestamp = new Date();
    return this.firestore.collection('races').add(race);
  }
  getRace(id: any) {
    return this.firestore.doc('races/' + id).snapshotChanges();
  }
  deleteRace(id: any) {
    return this.firestore.doc('races/' + id).delete();
  }
  updateRaceStatus(id: any, race: any) {
    race.timestamp = new Date();
    return this.firestore.doc('races/' + id).update(race);
  }


  /* **************** entry methods ******************* */
  getRaceEntries(id: any) {
    return this.firestore.doc('races/' + id).collection('raceEntries', ref => ref.orderBy('timestamp')).snapshotChanges();
  }
  getEntryDetails(raceId: any, entryId: any) {
    return this.firestore.doc('races/' + raceId).collection('raceEntries').doc(entryId).snapshotChanges();
  }
  addEntry(raceId: any, entry: any) {
    entry.timestamp = new Date();
    return this.firestore.doc('races/' + raceId).collection('raceEntries').add(entry);
  }
  deleteEntry(raceId: any, entryId: any) {
    return this.firestore.doc('races/' + raceId).collection('raceEntries').doc(entryId).delete();
  }
  updateEntry(raceId: any, entryId: any, entry: any) {
    if ( entry.resultChange !== null) {
      entry.resultChange = Number((entry.resultChange).toFixed(2));
    }
    entry.timestamp = new Date();
    return this.firestore.doc('races/' + raceId).collection('raceEntries').doc(entryId).update(entry);
  }
}
