import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { XlsxToJsonService } from '../../../services/xlsx-to-json-service';
import { ItemService } from '../item.service';
import { Item } from '../item';

@Component({
  selector: 'app-settings-import-item-dialog',
  templateUrl: './import-item-dialog.component.html',
  styleUrls: ['./import-item-dialog.component.scss'],
  providers: [ItemService]
})

export class ImportItemDialogComponent implements OnInit {
  @Language() lang: string;
  data: Item = new Item({});
  datas = [];
  public result: any;
  files: any;
  disabled: boolean = false;
  error: any;

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Item,
              private _itemService: ItemService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ImportItemDialogComponent>) {

    try {
      if (md_data) {
        this.data = new Item(md_data);
      } else {}
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
  }

  toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  onFileChange(evt: any) {
    // console.log('File Change : ' + evt.target.files[0]);
    const file = evt.target.files[0];
    this.xlsxToJsonService.processFileToJson({}, file).subscribe((data) => {
      this.result = JSON.stringify(data['sheets'].Sheet1);
      data['sheets'].Sheet1.forEach((s) => {
        s.min = Number.parseInt(s.min);
        s.max = Number.parseInt(s.max);
        s.disable = JSON.parse(s.disable);
        s.disable_select = JSON.parse(s.disable_select);

        this.datas.push(s);
        console.log('Result : ' + JSON.stringify(this.datas));
      });
    });
  }

  importData() {
    console.log('on Import');
    if (this.datas) {
      // console.log('Code :' + this.datas);
      this.datas.forEach( (_s) => {
        this._itemService.addData(_s).then(() => {
          this.dialogRef.close(_s);
          this._loadingService.resolve();
          this.snackBar.open('Import item succeed', '', {duration: 3000});
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      });
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
