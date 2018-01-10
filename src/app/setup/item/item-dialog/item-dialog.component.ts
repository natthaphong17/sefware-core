import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';

/*
Load data
*/
import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { ItemGroupService } from '../../item-group/item-group.service';
import { ItemSubGroupService } from '../../item-sub-group/item-sub-group.service';
import { UomService } from '../../uom/uom.service';
import { Item } from '../item';
import { ItemType } from '../../item-type/item-type';
import { ItemGroup } from '../../item-group/item-group';
import { ItemSubGroup } from '../../item-sub-group/item-sub-group';
import { Uom } from '../../uom/uom';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
  providers: [ItemService, ItemTypeService, ItemGroupService, ItemSubGroupService, UomService, UploadService]
})

export class ItemDialogComponent implements OnInit {

  @Language() lang: string;

  config: GalleryConfig;

  data: Item = new Item({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  types = [];
  groups = [];
  subgroups = [];
  uoms = [];
  storage_ref = '/main/settings/item';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Item,
              private _itemService: ItemService,
              private _itemtypeService: ItemTypeService,
              private _itemgroupService: ItemGroupService,
              private _itemsubgroupService: ItemSubGroupService,
              private _uomService: UomService,
              private _uploadService: UploadService,
              private _loadingService: TdLoadingService,
              public gallery: Gallery,
              public dialogRef: MatDialogRef<ItemDialogComponent>) {

    try {
      if (md_data) {
        this.data = new Item(md_data);
        console.log('DATA : ' + JSON.stringify(this.data));
        if (!this.data.image) {
          this.displayImage('../../../../../assets/images/placeholder.png');
        } else {
          this.displayImage(this.data.image);
        }

      } else {
        this.displayImage('../../../../../assets/images/placeholder.png');
        this._itemService.requestData().subscribe(() => {
          this.generateCode(null);
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.getItemTypeData();
    this.getUomData();
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

  getItemGroupData(typeCode) {
    this.groups = [];
    this.subgroups = [];
    this._itemgroupService.requestDataByType(typeCode).subscribe((snapshot) => {
      this._itemgroupService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemGroup(s);
        this.groups.push(_row);
      });
    });
    this.generateCode(typeCode + '000');
  }

  getItemSubGroupData(groupCode) {
    this.subgroups = [];
    this._itemsubgroupService.requestDataByGroup(groupCode).subscribe((snapshot) => {
      this._itemsubgroupService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemSubGroup(s);
        this.subgroups.push(_row);
      });
    });
    this.generateCode(groupCode + '00');
  }

  getUomData() {
    this._uomService.requestData().subscribe((snapshot) => {
      this._uomService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Uom(s.val());
        this.uoms.push(_row);
      });
    });
  }

  displayImage(path: string) {
    this.images = [];
    this.images.push({
      src: path,
      thumbnail: path,
      text: this.data.name1
    });
    this.gallery.load(this.images);
  }

  generateCode(Code) {
    if (this.disableSelect.value === true) {
      this._loadingService.register('data.form');
      let prefix = '0000';
      if (Code !== null) {
        prefix = Code;
      }
      this.data.code = prefix + '-0001';
      this._itemService.requestLastData(prefix).subscribe((s) => {
        console.log('Prev Code :' + JSON.stringify(s));
        s.forEach((ss: Item) => {
          console.log('Prev Code :' + ss.code);
          // tslint:disable-next-line:radix
          const str = parseInt(ss.code.substring(ss.code.length - 4, ss.code.length)) + 1;
          let last = prefix + '-' + str;
          if (str < 1000) {
            last = prefix + '-0' + str;
          }
          if (str < 100) {
            last = prefix + '-00' + str;
          }
          if (str < 10) {
            last = prefix + '-000' + str;
          }
          this.data.code = last;
        });
        this._loadingService.resolve('data.form');
      });
    }
  }

  changePrimaryUnit(unit) {
    this.uoms.forEach((c_unit) => {
      if (unit === c_unit.code) {
        this.data.primary_unit_name = c_unit.name1;
      }
    });
    console.log('changePrimaryUnit : ' + unit + ' -> ' + this.data.primary_unit_name);
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
          this._itemService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  uploadImage(file: File) {
    this._loadingService.register();
    // let file = event.target.files.item(0);

    const file_type = file.name.substring(file.name.lastIndexOf('.'));

    this._uploadService.pushUpload('image/*', this.storage_ref + '/' + this.data.code + '/' + this.data.code + '_' + new Date().getTime() + file_type, new Upload(file)).then((result) => {
      this.data.image = result.downloadURL;
      this.images = [];
      this.displayImage(this.data.image);
      this._loadingService.resolve();
    }).catch((err) => {
      console.log('err : ' + err.message);
      this._loadingService.resolve();
    });
  }

  removeImage() {
    this.data.image = '../../../../../assets/images/placeholder.png';
    this.displayImage(this.data.image);
    // this.displayImage('../../../../../assets/images/placeholder.png');
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
