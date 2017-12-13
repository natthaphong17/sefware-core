import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Language, LocaleService} from 'angular-l10n';
import {AuthService} from '../login/auth.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {TdMediaService} from '@covalent/core';
import {ResetPasswordComponent} from '../dialog/reset-password/reset-password.component';
import {UploadImageComponent} from '../dialog/upload-image/upload-image.component';
import * as firebase from 'firebase';
import { version as appVersion } from '../../../package.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  public appVersion;
  user: firebase.User;

  routes = [{
  //   title: 'Home',
  //   route: '/main',
  //   icon: 'home',
  // }, {
    title: 'Purchase',
    route: '/main',
    icon: 'shopping_cart',
  }, {
    title: 'Inventory',
    route: '/main',
    icon: 'store',
  }, {
    title: 'Fixed Assets',
    route: '/main',
    icon: 'directions_boat',
  }, {
    title: 'Account Payable',
    route: '/main',
    icon: 'local_parking',
  }, {
    title: 'Income Audit',
    route: '/main',
    icon: 'monetization_on',
  }, {
    title: 'Account Receivable',
    route: '/main',
    icon: 'credit_card',
  }, {
    title: 'General Ledger',
    route: '/main',
    icon: 'pie_chart',
  }, {
    title: 'Report',
    route: '/main',
    icon: 'find_in_page',
  // }, {
  //   title: 'Summary',
  //   route: '/main/summary',
  //   icon: 'web',
  // }, {
  //   title: 'Administrators',
  //   route: '/main/admin/user',
  //   icon: 'verified_user',
  },
  ];

  constructor(
    public _media: TdMediaService,
    public _authService: AuthService,
    private dialog: MatDialog,
    public router: Router,
    public locale: LocaleService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.appVersion = appVersion;
  }

  ngAfterViewInit(): void {
    this._media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
  }

  selectLanguage(language: string): void {
    this.locale.setCurrentLanguage(language);
  }

  logout() {
    this._authService.signout();
  }

  refresh() {
    location.reload();
  }

  // resetPassword() {
  //   this.dialog.open(ResetPasswordComponent, {
  //     data: {
  //       type: 'reset_password',
  //       title: 'Reset password',
  //       content: 'Send a password reset email.',
  //       data_title: 'User account',
  //       data: this.user.email
  //     }
  //   }).afterClosed().subscribe((confirm: boolean) => {
  //     if (confirm) {
  //       this._authService.resetPassword(this.user.email).then(_ => console.log('success'))
  //         .catch(err => console.log(err, 'You do not have access!'));
  //     }
  //   });
  // }
  //
  // openSetting() {
  //
  // }
  //
  // uploadProfile() {
  //   this.dialog.open(UploadImageComponent, {
  //     data: {
  //       title: 'Upload profile',
  //       link: this.user.photoURL,
  //       type: 'image/png',
  //       path: 'users_profile/' + this.user.uid + '.png'
  //     }
  //   }).afterClosed().subscribe((link: string) => {
  //     if (link) {
  //       this._authService.updateProfile(this.user.displayName, link).then(_ => console.log('success updateProfile'))
  //         .catch(err => console.log(err, 'You do not have access!'));
  //     }
  //   });
  // }
}
