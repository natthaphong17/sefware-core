import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ItemGroupService } from '../../item-group/item-group.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import * as _ from 'lodash';
import { ItemGroup } from '../../item-group/item-group';
import { ItemType } from '../../item-type/item-type';

@Component({
  selector: 'app-settings-item-group-dialog',
  templateUrl: './item-group-dialog.component.html',
  styleUrls: ['./item-group-dialog.component.scss'],
  providers: [ItemGroupService, ItemTypeService]
})
export class ItemGroupDialogComponent implements OnInit {
  @Language() lang: string;

  data: ItemGroup = new ItemGroup({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  types = [];
  storage_ref = '/main/settings/item_group';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: ItemGroup,
              private _itemgroupService: ItemGroupService,
              private _itemtypeService: ItemTypeService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<ItemGroupDialogComponent>) {

    try {
      if (md_data) {
        this.data = new ItemGroup(md_data);
      } else {
        this._itemgroupService.requestData().subscribe(() => {
          this.generateCode(null);
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
    this.getItemTypeData();
  }

  getItemTypeData() {
    this._itemtypeService.requestData().subscribe((snapshot) => {
      this._itemtypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemType(s.val());
        this.types.push(_row);
      });
    });
  }

  generateCode(typeCode) {
    if (this.disableSelect.value === true) {
      this._loadingService.register('data.form');
      let prefix = '0';
      if (typeCode !== null) {
        prefix = typeCode;
      }
      this.data.code = prefix + '1';
      this._itemgroupService.requestLastData(prefix).subscribe((s) => {
        console.log('Prev Code :' + JSON.stringify(s));
        s.forEach((ss: ItemGroup) => {
          console.log('Prev Code :' + ss.code);
          // tslint:disable-next-line:radix
          const str = parseInt(ss.code.substring(ss.code.length - 1, ss.code.length)) + 1;
          const last = prefix + str;

          this.data.code = last;
        });
        this._loadingService.resolve('data.form');
      });
    }
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
          this._itemgroupService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemgroupService.addData(this.data).then(() => {
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
