import { Component, OnInit, ViewChild } from '@angular/core';
import { Language } from 'angular-l10n';
import { LocationService } from './location.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService } from '@covalent/core';
import { SelectionModel } from '@angular/cdk/collections';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { Page } from '../../shared/model/page';
import { Location } from './location';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [LocationService]
})
export class LocationComponent implements OnInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _locationService: LocationService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 10;
    this.page.pageNumber = 0;

  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._locationService.requestData().subscribe((snapshot) => {
      this._locationService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Location(s.val());
        this._locationService.rows.push(_row);

      });

      this.temp = [...this._locationService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._locationService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '25%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  editData(data: Location) {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '25%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  deleteData(data: Location) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete unit',
        content: 'Confirm to delete?',
        data_title: 'Location',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._locationService.removeData(data).then(() => {
          this.snackBar.open('Delete unit succeed.', '', {duration: 3000});
          // this.addLog('Delete', 'delete unit succeed', data, {});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  updateFilter(event) {
    if (event === '') {
      this.setPage(null);
      return;
    }

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return (d.code.toLowerCase().indexOf(val) !== -1) ||
        (d.shortname && d.shortname.toLowerCase().indexOf(val) !== -1) ||
        (d.name1 && d.name1.toLowerCase().indexOf(val) !== -1) ||
        (d.name2 && d.name2.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
