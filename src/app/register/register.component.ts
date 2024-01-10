import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public form !: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth:AuthService, private router: Router,private matSnackbar: MatSnackBar){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10),
      ]],
        password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator, updateOn: 'submit' });
  }

  passwordMatchValidator(control: AbstractControl): void {
    const password = control.get('password')?.value ?? '';
    const confirmPassword = control.get('confirmPassword')?.value ?? '';
  
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
    }
  }

  signUp(){
    this.auth.register(this.form.value).subscribe(
      (response:any) => {
        this.matSnackbar.openFromComponent(SnackbarComponent, {
          data: AppConstants.signinSuccessDetail,
          panelClass: ['bg-danger'],
          duration: 5000
        });
        this.router.navigate(['/login']);

      },
      (error) => {
        console.log(error)
      }
    )
  }
}
