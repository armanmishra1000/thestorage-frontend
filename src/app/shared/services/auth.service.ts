// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { Router } from '@angular/router';
// import { environment } from '../../../environments/environment';

// const API_URL = `${environment.apiUrl}/auth`;

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(private http: HttpClient, private router: Router) { }

//   login(credentials: any): Observable<any> {
//     const formData = new FormData();
//     formData.append('username', credentials.email);
//     formData.append('password', credentials.password);
    
//     return this.http.post(`${API_URL}/token`, formData).pipe(
//       tap((response: any) => this.setSession(response))
//     );
//   }

//   register(user: any): Observable<any> {
//     return this.http.post(`${API_URL}/register`, user);
//   }

//   private setSession(authResult: any) {
//     localStorage.setItem('access_token', authResult.access_token);
//   }

//   logout() {
//     localStorage.removeItem('access_token');
//     this.router.navigate(['/login']);
//   }

//   public isLoggedIn(): boolean {
//     return !!localStorage.getItem('access_token');
//   }
// }


////////////07/07////////

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// Construct the specific API path for auth
const API_URL = `${environment.apiUrl}/api/v1/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    return this.http.post(`${API_URL}/token`, formData).pipe(
      tap((response: any) => this.setSession(response))
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, user);
  }

  private setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access_token);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}