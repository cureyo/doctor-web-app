import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AuthService} from './services/firebaseauth.service';
import {AngularFireModule, AuthProviders, AuthMethods, AngularFire, AngularFireAuth} from 'angularfire2';

@Injectable()

export class AuthGuard implements CanActivate{
  constructor(private auth: AngularFireAuth, private authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|boolean {


    // //console.log(route);
    // //console.log("\n");
    // //console.log(state);
    return this.auth.map((auth) => {
      // return !!auth;
      if (auth) {
        // //console.log('authenticated');
        // //console.log(route.url.toString());
        // if(route.url.toString() == 'login' ) {
        //   //console.log("true");
        //   this.router.navigate(['dashboard']);
        // }
        return true;
      }else{
        // not logged in so redirect to login page with the return url and return false
        this.router.navigate(['/doctor-login', { returnUrl: state.url }]);
        return false;
      }
      // //console.log('not authenticated');
      // this.router.navigate(['login']);
      // return false;
    }); // this might not be necessary - ensure `first` is imported if you use it

    // return this.authService.isAuthenticated().map(
    //   authenticated => {
    //     return !!authenticated
    //   });

    // return this.authService.af.auth
    //
    // // Observables returned by canActivate have to complete, so take the
    // // first emitted value from the auth observable.
    //
    //   .first()
    //
    //   // Use mergeMap to project the values emitted from the inner
    //   // observables created using Observable.fromPromise and
    //   // Observable.of. (If you weren't making the call to
    //   // sendEmailVerification, you could just use the map operator
    //   // and would return a boolean.)
    //
    //   .mergeMap((user) => {
    //
    //     // //console.log("user.auth:\n");
    //     // //console.log(user.auth);
    //     if (user && user.auth) {
    //       this.router.navigate(['dashboard']);
    //       return Observable.of(true);
    //     } else {
    //       // this.router.navigate(['login']);
    //       return Observable.of(false);
    //     }
    //   });
  }

}
