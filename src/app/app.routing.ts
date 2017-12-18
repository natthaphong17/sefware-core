/**
 * Created by chaiwut on 7/18/17.
 */

import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './main/page-not-found/page-not-found.component';
import {MainComponent} from './main/main.component';
import {HomeComponent} from './main/home/home.component';

import {RequireUnauthGuard} from './login/guards/require-unauth.guard';
import {RequireAuthGuard} from './login/guards/require-auth.guard';
import {TestComponent} from './pages/test/test.component';
import { ItemTypeDialogComponent } from './setup/item-type/item-type.component';

// import {AdminComponent} from "./main/admin/admin.component";
// import {ContractrateComponent} from "./main/contractrate/contractrate.component";

export {RequireAuthGuard} from './login/guards/require-auth.guard';

const appRoutes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'login',
    canActivate: [RequireUnauthGuard],
    component: LoginComponent
  },
  {
    path: 'main',
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            children: [
              {path: '', component: HomeComponent},
              {
                path: '',
                children: [
                  {path: 'item-type', component: ItemTypeDialogComponent}
                ]
              },
              {path: 'summary', loadChildren: 'app/main/summary/summary.module#SummaryModule'},
              // {
              //   path: 'admin',
              //   component: AdminComponent,
              //   children: [
              //     {
              //       path: '',
              //       children: [
              //         {path: 'user', loadChildren: 'app/main/admin/user/user.module#UserModule'},
              //         {path: 'role', loadChildren: 'app/main/admin/role/role.module#RoleModule'},
              //         {path: 'guide', loadChildren: 'app/main/admin/guide/guide.module#GuideModule'},
              //         {path: 'driver', loadChildren: 'app/main/admin/driver/driver.module#DriverModule'},
              //         {path: 'booking-path', loadChildren: 'app/main/admin/booking-path/booking-path.module#BookingPathModule'},
              //         {path: 'log', loadChildren: 'app/main/admin/log/log.module#LogModule'},
              //       ]
              //     }
              //   ]
              // }
            ]
          }
        ]
      }
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: Boolean(history.pushState) === false, preloadingStrategy: PreloadAllModules})
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class AppRoutingModule {
}

export const routedComponents: any[] = [
  LoginComponent,
  PageNotFoundComponent,
  MainComponent,
  HomeComponent,
  ItemTypeDialogComponent
  // BookingComponent,
  // AllotmentComponent,
  // OvermoneyComponent,
  // FinancialComponent,
  // AdminComponent
];
