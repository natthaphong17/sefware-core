import { Component, Inject, OnInit } from '@angular/core';
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
  // types: ItemType = new ItemType({});
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
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this._itemtypeService.requestData().subscribe((snapshot) => {
      this._itemtypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemType(s.val());
        this.types.push(_row);
      });
    });
  }

  generateCode() {
    this._loadingService.register('data.form');
    const prefix = 'GRP';
    this.data.code = prefix + '-001';
    console.log('Prev Code :' + this.data.code);
    this._itemgroupService.requestLastData().subscribe((s) => {
      s.forEach((ss: ItemGroup) => {
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
