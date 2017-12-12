/**
 * Created by chaiwut on 7/18/17.
 */

import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
// import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './main/page-not-found/page-not-found.component';
import {MainComponent} from './main/main.component';
import {HomeComponent} from './main/home/home.component';
// import {BookingComponent} from './main/booking/booking.component';
// import {AllotmentComponent} from './main/allotment/allotment.component';
// import {OvermoneyComponent} from './main/overmoney/overmoney.component';
// import {FinancialComponent} from './main/financial/financial.component';
// import {RequireUnauthGuard} from './login/guards/require-unauth.guard';
import {RequireAuthGuard} from "./login/guards/require-auth.guard";
import {TestComponent} from "./pages/test/test.component";
// import {AdminComponent} from "./main/admin/admin.component";
// import {ContractrateComponent} from "./main/contractrate/contractrate.component";

export {RequireAuthGuard} from './login/guards/require-auth.guard';

const appRoutes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },
  // {
  //   path: 'login',
  //   canActivate: [RequireUnauthGuard],
  //   component: LoginComponent
  // },
  {
    path: 'main',
  //   canActivate: [RequireAuthGuard],
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            children: [
              {path: '', component: HomeComponent},
              // {path: 'booking', component: BookingComponent},
              // {path: 'allotment', component: AllotmentComponent},
              // {path: 'overmoney', component: OvermoneyComponent},
              // {path: 'financial', component: FinancialComponent},
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
  // {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: Boolean(history.pushState) === false,preloadingStrategy: PreloadAllModules})
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class AppRoutingModule {
}

export const routedComponents: any[] = [
  // LoginComponent,
  PageNotFoundComponent,
  MainComponent,
  HomeComponent,
  // BookingComponent,
  // AllotmentComponent,
  // OvermoneyComponent,
  // FinancialComponent,
  // AdminComponent
];
