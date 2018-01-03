import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Supplier} from './supplier';
import {Observable} from 'rxjs';
import { PagedData } from '../../shared/model/paged-data';
import { Page } from '../../shared/model/page';

@Injectable()
export class SupplierService {

  lists: FirebaseListObservable<any>;
  rows: Supplier[] = [];
  _path: string = '/supplier';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  getPath(): string {
    return this._path;
  }

  requestData() {
    return this.lists;
  }

  requestDataByCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  addData(data: Supplier) {
    return this.lists.update(data.code, data);
  }

  updateData(data: Supplier) {
    return this.lists.update(data.code, data);
  }

  updateDataStatus(data: Supplier, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: Supplier) {
    return this.lists.remove(data.code);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<Supplier>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<Supplier> {
    const pagedData = new PagedData<Supplier>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new Supplier(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
