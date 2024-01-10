import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  public loogin(loginData: any) {
    return this.httpClient.post(`/api/auth/login`,loginData);
  }

  public register(registerData: any) {
    return this.httpClient.post(`/api/auth/register`,registerData);
  }
}
