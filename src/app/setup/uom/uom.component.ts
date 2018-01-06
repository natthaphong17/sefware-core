import { Component, OnInit, ViewChild } from '@angular/core';
import { Language } from 'angular-l10n';
import { UomService } from '../uom/uom.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService } from '@covalent/core';
import { SelectionModel } from '@angular/cdk/collections';
import { UomDialogComponent } from '../uom/uom-dialog/uom-dialog.component';
import { Page } from '../../shared/model/page';
import { Uom } from '../uom/uom';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';

@Component({
  selector: 'app-settings-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  providers: [UomService]
})
export class UomComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _uomService: UomService,
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
    this._uomService.requestData().subscribe((snapshot) => {
      this._uomService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Uom(s.val());
        this._uomService.rows.push(_row);

      });

      this.temp = [...this._uomService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._uomService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(UomDialogComponent, {
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

  editData(data: Uom) {
    const dialogRef = this.dialog.open(UomDialogComponent, {
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

  deleteData(data: Uom) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete unit',
        content: 'Confirm to delete?',
        data_title: 'UOM',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._uomService.removeData(data).then(() => {
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
