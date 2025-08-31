import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/appconstants/user.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  public login(loginData: any) {
    return this.httpClient.post(`${environment.url}/auth/signin`,loginData);
  }

  public register(registerData: any) {
    return this.httpClient.post(`${environment.url}/auth/signup`,registerData);
  }

  public setRoles(roles:[]) {
    localStorage.setItem("roles",JSON.stringify(roles));
  }

  public setUser(user:string) {
    localStorage.setItem("user",user);
  }

  public getRoles(): [] {
    const userRoles = localStorage.getItem("roles");
    return userRoles !== null ? JSON.parse(userRoles) : [];
  }

  public setToken(token:string) {
    localStorage.setItem("jwtToken",token);
  }

  public setProfile(profile:string) {
    localStorage.setItem("profile",profile);
  }

  public getToken() {
    return localStorage.getItem("jwtToken");
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  public getUsername() {
    return localStorage.getItem('user');
  }

  public logout() {
    localStorage.clear();
  }

  public roleMatch(allowedRoles: any):boolean {
    let isMatch = false;
    const userRoles:any = this.getRoles();

    if(allowedRoles.length === 0) {
      return true;
    }

    if(userRoles != null && userRoles) {
      for(let i=0;i<userRoles.length; i++) {
        for(let j=0;j<allowedRoles.length;j++) {
          if(userRoles[i] === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          }
        }
      }
    }

    return false;
  }
}
