import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/appconstants/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  public login(loginData: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/signin`,loginData);
  }

  public register(registerData: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/signup`,registerData);
  }

  public setRoles(roles:[]) {
    localStorage.setItem("roles",JSON.stringify(roles));
  }

  public setUser(user:User) {
    localStorage.setItem("user",JSON.stringify(user));
  }

  public getRoles(): [] {
    const userRoles = localStorage.getItem("roles");
    return userRoles !== null ? JSON.parse(userRoles) : null;
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
    const user = localStorage.getItem('user');
    if(user!==null) {
      return JSON.parse(user).username;
    }
    return null;
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
          if(userRoles[i].authority === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          }
        }
      }
    }

    return false;
  }
}
