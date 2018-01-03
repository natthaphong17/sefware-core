import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Language } from 'angular-l10n';
import { TdLoadingService } from '@covalent/core';
import { Supplier } from '../supplier';
import { SupplierService } from '../supplier.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-supplier-dialog',
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.scss'],
  providers: [SupplierService]
})
export class SupplierDialogComponent implements OnInit {
  @Language() lang: string;

  public data: Supplier = new Supplier({});
  error: any;
  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Supplier,
              private _supplierService: SupplierService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<SupplierDialogComponent>) {
                try {
                  if (md_data) {
                    this.data = new Supplier(md_data);

                  } else {
                    this._supplierService.requestData().subscribe(() => {
                      this.generateCode();
                    });
                  }
                } catch (error) {
                  this.error = error;
                }
              }
 ngOnInit() {
 }

 generateCode() {
  this._loadingService.register('data.form');
  this.data.code = 'SP-001';
  console.log('code :' + this.data.code);
  this._supplierService.requestLastData().subscribe((s) => {
    s.forEach((ss: Supplier) => {
      const str = parseInt (ss.code.substring(ss.code.length - 3, ss.code.length)) + 1;
      let last = 'SP-' + str;

      if (str < 100) {
        last = 'SP-0' + str;
      }

      if (str < 10) {
        last = 'SP-00' + str;
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

    this.data.fax = form.value.fax ? form.value.fax : null;
    this.data.dn1 = form.value.dn1 ? form.value.dn1 : null;
    this.data.dn2 = form.value.dn2 ? form.value.dn2 : null;
    this.data.address = form.value.address ? form.value.address : null;
    this.data.tel = form.value.tel ? form.value.tel : null;
    this.data.phone = form.value.phone ? form.value.phone : null;
    this.data.email = form.value.email ? form.value.email : null;
    this.data.term = form.value.term ? form.value.term : null;
    this.data.bank = form.value.bank ? form.value.bank : null;

    if (this.md_data) {

      if (_.isEqual(this.data, this.md_data)) {
        this.dialogRef.close(false);
      } else {
        this._supplierService.updateData(this.data).then(() => {
          this.dialogRef.close(true);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    } else {
      this._supplierService.addData(this.data).then(() => {
        this.dialogRef.close(true);
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
