import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
// import {DriverService} from "../driver.service";
import {Upload} from '../../../../shared/model/upload';
import {UploadService} from '../../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';

import {ItemTypeDialogComponent} from './item-type-dialog/item-type-dialog.component';

@Component({
  selector: 'app-main-settings-item--type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.scss'],
})
export class ItemTypeComponent implements OnInit {
  @Language() lang: string;
  constructor(private dialog: MatDialog) {
  }
  ngOnInit(): void {
  }
  addData() {
    const dialogRef = this.dialog.open(ItemTypeDialogComponent, {
      disableClose: true,
      width: '300px',
      height: '200px'
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
