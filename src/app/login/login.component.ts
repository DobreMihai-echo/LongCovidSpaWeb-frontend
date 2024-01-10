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


  login(){
    this.auth.login(this.loginForm.value).subscribe(
      (response:any) => {
        this.auth.setToken(response.jwtToken);
        this.auth.setRoles(response.users.authorities)
        this.auth.setUser(response.users);
        this.auth.setProfile(response.profilePhoto);
        this.router.navigate(['/home']);
        this.matSnackbar.openFromComponent(SnackbarComponent, {
          data: AppConstants.signinSuccessDetail,
          panelClass: ['bg-danger'],
          duration: 5000
        });

      },
      (error) => {
        this.matSnackbar.openFromComponent(SnackbarComponent, {
          data: error ? error : AppConstants.snackbarErrorContent,
          panelClass: ['bg-danger'],
          duration: 5000
        });
        console.log(error)
      }
    )
  }
}
