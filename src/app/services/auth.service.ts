import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = "http://34.125.41.225";

  constructor(private httpClient: HttpClient) { }

  public loogin(loginData: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/login`,loginData);
  }

  public register(registerData: any) {
    return this.httpClient.post(`${this.baseUrl}/api/auth/register`,registerData);
  }
}
