import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatTableDataSource, MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Upload} from '../../shared/model/upload';
import {UploadService} from '../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemTypeService} from './item-type.service';
import {ItemTypeDialogComponent} from './item-type-dialog/item-type-dialog.component';
import {ItemType} from './item-type';

@Component({
  selector: 'app-main-settings-item--type',
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

    this.page.size = 50;
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
      width: '350px',
      height: '300px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }
  openLink(link: string) {
    window.open(link, '_blank');
  }
}
