import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';
import * as XLSX from 'xlsx';
/**
 * This is use to conver excel sheet into json object
 */
@Injectable()
export class XlsxToJsonService {

  public processFileToJson(object, file): Observable<any> {
    const reader = new FileReader();
    const _this = this;

    return Observable.create((observer) => {
      reader.onload = function(e) {
        const data = e.target['result'];
        const workbook = XLSX.read(data, {
          type: 'binary'
        });
        object.sheets = _this.parseWorksheet(workbook, true, true);
        observer.next(object);
        observer.complete();
      };
      reader.readAsBinaryString(file);
    });
  }

  parseWorksheet(workbook, readCells, toJSON) {
    if (toJSON === true) {
      return this.to_json(workbook);
    }
    const sheets = {};
    _.forEachRight(workbook.SheetNames, function(sheetName) {
      const sheet = workbook.Sheets[sheetName];
      sheets[sheetName] = this.parseSheet(sheet, readCells);
    });
    return sheets;
  }

  parseSheet(sheet, readCells) {
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const sheetData = [];

    if (readCells === true) {
      _.forEachRight(_.range(range.s.r, range.e.r + 1), function(row) {
        const rowData = [];
        _.forEachRight(_.range(range.s.c, range.e.c + 1), function(column) {
          const cellIndex = XLSX.utils.encode_cell({
            c: column,
            r: row
          });
          const cell = sheet[cellIndex];
          rowData[column] = cell ? cell.v : undefined;
        });
        sheetData[row] = rowData;
      });
    }

    return {
      sheet: sheetData,
      name: sheet.name,
      col_size: range.e.c + 1,
      row_size: range.e.r + 1
    };
  }

  to_json(workbook) {
    const result = {};
    workbook.SheetNames.forEach(function(sheetName) {
      const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (roa.length > 0) {
        result[sheetName] = roa;
      }
    });
    return result;
  }
}
