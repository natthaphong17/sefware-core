import { Component, OnInit, ViewChild } from '@angular/core';
import { Language } from 'angular-l10n';
import { DepartmentService } from './department.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService } from '@covalent/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { Page } from '../../shared/model/page';
import { Department } from './department';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  providers: [DepartmentService]
})
export class DepartmentComponent implements OnInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _departmentService: DepartmentService,
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
    this._departmentService.requestData().subscribe((snapshot) => {
      this._departmentService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Department(s.val());
        this._departmentService.rows.push(_row);

      });

      this.temp = [...this._departmentService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._departmentService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
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

  editData(data: Department) {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
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

  deleteData(data: Department) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete unit',
        content: 'Confirm to delete?',
        data_title: 'Department',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._departmentService.removeData(data).then(() => {
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
    const temp = this.temp.filter(function (d) {
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
