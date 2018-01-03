import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemTypeService} from './item-type.service';
import {ItemTypeDialogComponent} from './item-type-dialog/item-type-dialog.component';
import {ItemType} from './item-type';

@Component({
  selector: 'app-settings-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.scss'],
  providers: [ItemTypeService]
})
export class ItemTypeComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _itemtypeService: ItemTypeService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 5;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._itemtypeService.requestData().subscribe((snapshot) => {
      this._itemtypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemType(s.val());
        this._itemtypeService.rows.push(_row);

      });

      this.temp = [...this._itemtypeService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._itemtypeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(ItemTypeDialogComponent, {
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

  editData(data: ItemType) {
    const dialogRef = this.dialog.open(ItemTypeDialogComponent, {
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

  deleteData(data: ItemType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete item type',
        content: 'Confirm to delete?',
        data_title: 'Item Type',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemtypeService.removeData(data).then(() => {
          this.snackBar.open('Delete item type succeed.', '', {duration: 3000});
          // this.addLog('Delete', 'delete item type succeed', data, {});

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
