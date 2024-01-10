import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { AppConstants } from '../models/appconstants/appconstants.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public signUpForm !: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth:AuthService, private router: Router,private matSnackbar: MatSnackBar){}

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      username: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    })
  }

  signUp(){
    this.auth.register(this.signUpForm).subscribe(
      (response:any) => {
        this.matSnackbar.openFromComponent(SnackbarComponent, {
          data: AppConstants.signinSuccessDetail,
          panelClass: ['bg-danger'],
          duration: 5000
        });
        this.router.navigate(['login']);
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
