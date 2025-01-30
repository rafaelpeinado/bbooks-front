import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bbooks';

  constructor(
    public auth: AuthService,

  ) {
  }

  ngOnInit(): void {
    // this.idleService.startWatching(600)
    //     .subscribe((isUserInactive) => {
    //       if (isUserInactive) {
    //         if ( this.auth.getUser() !== null) {
    //           this.translate.get('PADRAO.SESSAO_EXPIRADA').subscribe(message => {
    //             Util.showErrorDialog(message);
    //           });
    //           this.auth.logout();
    //           this.router.navigateByUrl('/login');
    //           this.idleService.resetTimer();
    //         }
    //       }
    //     });
  }

}
