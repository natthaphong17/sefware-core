import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
// import {DriverService} from "../driver.service";
import {Upload} from '../../../../shared/model/upload';
import {UploadService} from '../../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';

@Component({
  selector: 'app-main-settings-item--type-add--item--type',
  templateUrl: './item-type-dialog.component.html',
  styleUrls: ['./item-type-dialog.component.scss'],
})
export class ItemTypeDialogComponent implements OnInit {
  @Language() lang: string;
  private dialog: MatDialog;
  ngOnInit(): void {
  }
  saveData() {
  }
  openLink(link: string) {
    window.open(link, '_blank');
  }

}
