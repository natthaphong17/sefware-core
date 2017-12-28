import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ItemTypeComponent} from './item-type.component';
import { ItemTypeDialogComponent } from './item-type-dialog/item-type-dialog.component';

const ITEM_TYPE_ROUTER: Routes = [
  {
    path: '',
    component: ItemTypeComponent,
    children: [
      {path: 'item-type-dialog', component: ItemTypeDialogComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ITEM_TYPE_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class ItemTypeRouting {}

export const routedComponents: any[] = [
  ItemTypeDialogComponent
];
