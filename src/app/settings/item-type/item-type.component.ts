import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
// import {DriverService} from "../driver.service";
// import {Attachments, Driver} from "../driver";
import {Upload} from '../../../../shared/model/upload';
import {UploadService} from '../../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';

@Component({
  selector: 'app-main-settings-item--type',
  templateUrl: '../item-type/item-type.component.html',
  styleUrls: ['../item-type/item-type.component.scss'],
})
export class ItemTypeDialogComponent implements OnInit {
  @Language() lang: string;
  ngOnInit(): void {
  }
  openLink(link: string) {
    window.open(link, '_blank');
  }

}
