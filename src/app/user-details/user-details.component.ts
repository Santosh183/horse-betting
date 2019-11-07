import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase-service/firebase.service';
import { ExcelService } from '../excel-service/excel.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  showSpinner = false;
  user = {
    userNumber : null,
    userName: '',
    balance: null
  };
  races: any[] = [];
  currentUserId: any;
  allUserEntries: any[] = [];
  constructor(public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private firebase: FirebaseService,
              private excelService: ExcelService) {
  }

  ngOnInit() {
    this.user.userNumber = this.route.snapshot.params['id'];
    this.currentUserId = null;
    const s = this.firebase.getUser(this.user.userNumber);
    let p = s.subscribe(
      (user: any) => {
       this.user =  user.map(e => {
          this.currentUserId = e.payload.doc.id;
          return {
            userNumber: e.payload.doc.data()[ 'userNumber'],
            userName: e.payload.doc.data()[ 'userName'],
            balance: e.payload.doc.data()[ 'userBalance']
          };
       })[0];

      },
      (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(p);

    const x = this.firebase.getRaces();
    let f = x.subscribe(
    (races) => {
        this.races = races.map(e => {
            return {
              raceId: e.payload.doc.id,
              raceHorses: e.payload.doc.data()[ 'raceHorses'],
              raceNumber: e.payload.doc.data()[ 'raceNumber'],
              raceDate: e.payload.doc.data()[ 'raceDate'],
              status: e.payload.doc.data()[ 'status'],
              cancelledHorses: e.payload.doc.data()['cancelledHorses'] ,
              SHP_rate: e.payload.doc.data()['SHP_rate'] ,
              THP_rate: e.payload.doc.data()['THP_rate'] ,
              winnerDeduction: e.payload.doc.data()['winnerDeduction'] ,
              rankDeduction: e.payload.doc.data()['rankDeduction']
            };
        });
        for ( let i = 0; i < this.races.length; i++) {

          let r = this.firebase.getRaceEntries(this.races[i].raceId).subscribe(
            (entry) => {
              let tempEntry: any[] =  entry.map(e => {
                return {
                  entryId: e.payload.doc.id,
                  raceId: this.races[i].raceId,
                  raceNumber: this.races[i].raceNumber,
                  raceStatus: this.races[i].status,
                  raceDate: this.races[i].raceDate,
                  rank: e.payload.doc.data().rank,
                  resultChange: e.payload.doc.data().resultChange,
                  rate: e.payload.doc.data().rate,
                  taxRate: e.payload.doc.data().taxRate,
                  userNumber: e.payload.doc.data().userNumber,
                  userName: e.payload.doc.data().userName,
                  investedAmount: e.payload.doc.data().investedAmount,
                  bettingType: e.payload.doc.data().bettingType,
                  horseNumber: e.payload.doc.data().horseNumber
                };
              });
              // tslint:disable-next-line:prefer-for-of
              for ( let j = 0; j < tempEntry.length; j++) {
                if (this.user.userNumber === tempEntry[j].userNumber ) {
                  this.allUserEntries.push(tempEntry[j]);
                }
              }
            }
          );
          this.subscriptions.push(r);
        }
      }
    );
    this.subscriptions.push(f);

  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {userNumber: this.user.userNumber}
    });

    let g =
    dialogRef.afterClosed().subscribe(async (result) => {
      try {
      if ( result === true) {

        this.showSpinner = true;
        let deletePromiseArray= [];
        // tslint:disable-next-line:prefer-for-of
        for ( let j = 0; j < this.allUserEntries.length; j++) {
          deletePromiseArray.push(this.firebase.deleteEntry(this.allUserEntries[j].raceId, this.allUserEntries[j].entryId));
        }
        await Promise.all(deletePromiseArray);
        await this.firebase.deleteUser(this.currentUserId);
        this.showSpinner = false;
        this.router.navigate(['/userlist']);
      }
    }  catch ( err ) {
        console.log('User-detail:: openDeleteDialog :: Error", err');
      }
    });
    this.subscriptions.push(g);
  }


  exportExcel() {
    let excelEntries =
    this.allUserEntries.map(
      (entry) => {

        let race = this.races.find(
          (race) => {
            return race.raceNumber === entry.raceNumber;
          }
        );
        let temp = '';
        for ( let i = 0; i < race.cancelledHorses.length; i++) {
          if( i === race.cancelledHorses.length - 1) {
            temp = temp + race.cancelledHorses[i];
          } else {
            temp = temp + race.cancelledHorses[i] + ', ';
          }
        }
        if ( entry.bettingType === 'SHP') {
          return {
            user_no: entry.userNumber,
            user_name: entry.userName,
            race_no: entry.raceNumber,
            horse_no: entry.horseNumber,
            investment: entry.investedAmount,
            rank: entry.rank,
            result: entry.resultChange,
            race_status: entry.raceStatus,
            race_date: this.convertToDate(entry.raceDate),
            rate: race.SHP_rate,
            deductionRate: 0,
            deduction_amount: 0,
            cancelled_horses: temp,
            tax_rate: entry.taxRate,
            betting_type: entry.bettingType,
          };
        }
        if ( entry.bettingType === 'THP') {
          return {
            user_no: entry.userNumber,
            user_name: entry.userName,
            race_no: entry.raceNumber,
            horse_no: entry.horseNumber,
            investment: entry.investedAmount,
            rank: entry.rank,
            result: entry.resultChange,
            race_status: entry.raceStatus,
            race_date: this.convertToDate(entry.raceDate),
            rate: race.THP_rate,
            deductionRate: 0,
            deduction_amount: 0,
            cancelled_horses: temp,
            tax_rate: entry.taxRate,
            betting_type: entry.bettingType,
          };
        }
        if ( entry.bettingType === 'WINNER') {
          return {
            user_no: entry.userNumber,
            user_name: entry.userName,
            race_no: entry.raceNumber,
            horse_no: entry.horseNumber,
            investment: entry.investedAmount,
            rank: entry.rank,
            result: entry.resultChange,
            race_status: entry.raceStatus,
            race_date: this.convertToDate(entry.raceDate),
            rate: entry.rate,
            deductionRate: race.winnerDeduction,
            deduction_amount: (entry.investedAmount * entry.rate * race.winnerDeduction) / 100,
            cancelled_horses: temp,
            tax_rate: entry.taxRate,
            betting_type: entry.bettingType,
          };
        }
        if ( entry.bettingType === 'PLACE') {
          return {
            user_no: entry.userNumber,
            user_name: entry.userName,
            race_no: entry.raceNumber,
            horse_no: entry.horseNumber,
            investment: entry.investedAmount,
            rank: entry.rank,
            result: entry.resultChange,
            race_status: entry.raceStatus,
            race_date: this.convertToDate(entry.raceDate),
            rate: entry.rate,
            deductionRate: race.winnerDeduction,
            deduction_amount: (entry.investedAmount * entry.rate * race.rankDeduction) / 100,
            cancelled_horses: temp,
            tax_rate: entry.taxRate,
            betting_type: entry.bettingType,
          };
        }


      }
    );
    
    this.excelService.exportAsExcelFile(excelEntries, this.user.userNumber + '_' + this.user.userName);
  }

  convertToDate(timestamp: any) {
    let d =  new Date(timestamp.seconds * 1000);
    d = new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000));
    const temp = d.toISOString().slice(0, 10).split('-');
    return temp[2] + '-' + temp[1] + '-' + temp[0];
  }


  navigateToEditUser() {
    this.router.navigate(['/edituser', this.user.userNumber]);
  }


  ngOnDestroy() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.subscriptions.length ; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }


}
