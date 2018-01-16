import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {Language} from 'angular-l10n';
import * as _ from 'lodash';
import { XlsxToJsonService } from '../../../services/xlsx-to-json-service';

@Component({
  selector: 'app-settings-import-item-dialog',
  templateUrl: './import-item-dialog.component.html',
  styleUrls: ['./import-item-dialog.component.scss']
})
export class ImportItemDialogComponent implements OnInit {
  @Language() lang: string;
  public result: any;
  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();

  constructor() {}

  ngOnInit() {
  }

  onFileChange(evt: any) {
    console.log('File Change : ' + evt.target.files[0]);

    const file = evt.target.files[0];
    this.xlsxToJsonService.processFileToJson({}, file).subscribe((data) => {
      this.result = JSON.stringify(data['sheets'].Sheet1);
      console.log('Result : ' + this.result);
    });
  }

  importData() {
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
