import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportItemDialogComponent } from './import-item-dialog.component';

describe('ImportItemDialogComponent', () => {
  let component: ImportItemDialogComponent;
  let fixture: ComponentFixture<ImportItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
