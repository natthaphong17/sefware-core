import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from '../../setup/supplier/supplier.service';
import { SupplierDialogComponent } from '../../setup/supplier/supplier-dialog/supplier-dialog.component';
import { Language } from 'angular-l10n';
import { Page } from '../../shared/model/page';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TdMediaService } from '@covalent/core';
import { Supplier } from '../../setup/supplier/supplier';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  providers: [SupplierService]
})
export class SupplierComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _supplierService: SupplierService,
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
    this._supplierService.requestData().subscribe((snapshot) => {
      this._supplierService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Supplier(s.val());
        this._supplierService.rows.push(_row);

      });

      this.temp = [...this._supplierService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._supplierService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      disableClose: true,
      width: '75%',
      height: '75%'
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
