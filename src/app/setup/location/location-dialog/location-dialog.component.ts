import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { Location } from '../location';
import { LocationService } from '../location.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss'],
  providers: [LocationService]
})
export class LocationDialogComponent implements OnInit {

  data: Location = new Location({});
  error: any;
  images = [];
  storage_ref = '/main/settings/location';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Location,
              private _locationService: LocationService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<LocationDialogComponent>) {

    try {
      if (md_data) {
        this.data = new Location(md_data);
      } else {
        this._locationService.requestData().subscribe(() => {
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
    const prefix = 'LCT';
    this.data.code = prefix + '-001';
    console.log('Prev Code :' + this.data.code);
    this._locationService.requestLastData().subscribe((s) => {
      s.forEach((ss: Location) => {
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
          this._locationService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._locationService.addData(this.data).then(() => {
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
