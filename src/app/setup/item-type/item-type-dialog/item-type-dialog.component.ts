import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import { ItemTypeService } from '../item-type.service';
import { ItemType } from '../item-type';
import * as _ from 'lodash';

@Component({
  selector: 'app-main-settings-item--type--dialog',
  templateUrl: './item-type-dialog.component.html',
  styleUrls: ['./item-type-dialog.component.scss'],
  providers: [ItemTypeService, UploadService]
})

export class ItemTypeDialogComponent implements OnInit {
  @Language() lang: string;

  data: ItemType = new ItemType({});
  error: any;
  images = [];
  storage_ref = '/main/settings/item_type';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: ItemType,
              private _itemtypeService: ItemTypeService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<ItemTypeDialogComponent>) {

    try {
      if (md_data) {
        this.data = new ItemType(md_data);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }

      } else {
        this.displayImage('../../../../../assets/images/user.png');
        this._bookingpathService.requestData().subscribe(() => {
          this.generateCode();
        });*/
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
  }

  generateCode() {
    this._loadingService.register('data.form');
    const prefix = 'ITT';
    this.data.code = prefix + '-001';
    console.log('Code :');
    this._itemtypeService.requestLastData().subscribe((s) => {
      s.forEach((ss: ItemType) => {
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 3, ss.code.length)) + 1;
        let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }

        this.data.code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._itemtypeService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemtypeService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
