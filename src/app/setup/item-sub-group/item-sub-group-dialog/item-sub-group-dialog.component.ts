import { Component, Inject, OnInit } from '@angular/core';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ItemSubGroupService } from '../../item-sub-group/item-sub-group.service';
import * as _ from 'lodash';
import { ItemSubGroup } from '../../item-sub-group/item-sub-group';

@Component({
  selector: 'app-settings-item-sub-group-dialog',
  templateUrl: './item-sub-group-dialog.component.html',
  styleUrls: ['./item-sub-group-dialog.component.scss'],
  providers: [ItemSubGroupService]
})
export class ItemSubGroupDialogComponent implements OnInit {
  @Language() lang: string;

  data: ItemSubGroup = new ItemSubGroup({});
  error: any;
  images = [];
  storage_ref = '/main/settings/item_group';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: ItemSubGroup,
              private _itemsubgroupService: ItemSubGroupService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<ItemSubGroupDialogComponent>) {

    try {
      if (md_data) {
        this.data = new ItemSubGroup(md_data);
      } else {
        this._itemsubgroupService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
  }

  generateCode() {
    this._loadingService.register('data.form');
    const prefix = 'SGRP';
    this.data.code = prefix + '-001';
    console.log('Prev Code :' + this.data.code);
    this._itemsubgroupService.requestLastData().subscribe((s) => {
      s.forEach((ss: ItemSubGroup) => {
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
          this._itemsubgroupService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemsubgroupService.addData(this.data).then(() => {
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
