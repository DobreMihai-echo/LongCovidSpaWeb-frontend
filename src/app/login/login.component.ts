import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstants } from '../models/appconstants/appconstants.module';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	public loginForm!: FormGroup

  constructor(private formbuilder: FormBuilder,private http: HttpClient, private router: Router, private auth: AuthService, private matSnackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  login() {
    this.auth.login(this.loginForm.value).subscribe(
      (response: any) => {
        console.log(response)
        if (response.jwtToken) {
          this.auth.setToken(response.jwtToken);
          this.auth.setRoles(response.roles || []);
          // this.auth.setUser(response.users);
          // this.auth.setProfile(response.profilePhoto);
          this.router.navigate(['/home']);

          this.matSnackbar.openFromComponent(SnackbarComponent, {
            data: AppConstants.signinSuccessDetail,
            panelClass: ['bg-danger'],
            duration: 5000
          });
        } else {
          // Handle unexpected response structure
          this.matSnackbar.openFromComponent(SnackbarComponent, {
            data: 'Unexpected response structure from server.',
            panelClass: ['bg-danger'],
            duration: 5000
          });
        }
      },
      (error) => {
        console.error("Error", error);
        this.matSnackbar.openFromComponent(SnackbarComponent, {
          data: error.error?.message || 'Login failed.',
          panelClass: ['bg-danger'],
          duration: 5000
        });
      }
    );
  }

}
