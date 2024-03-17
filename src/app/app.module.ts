import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatListModule } from '@angular/material/list'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AboutPageComponent } from './about-page/about-page.component'
import { AppRoutingModule, routingComponents } from './app-routing.module'
import { AppComponent } from './app.component'
import { GeneralLayoutComponent } from './general-layout/general-layout.component'
import { NavbarComponent } from './navbar/navbar.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TechnologyPageComponent } from './technology-page/technology-page.component';
import { FooterPageComponent } from './footer-page/footer-page.component'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { PatientsTableComponent } from './pages/patients-table/patients-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		routingComponents,
		GeneralLayoutComponent,
		AboutPageComponent,
		PageNotFoundComponent,
  	TechnologyPageComponent,
  		FooterPageComponent,
    SnackbarComponent,
    PatientsComponent,
    PatientDetailsComponent,
    ForbiddenComponent,
    PatientsTableComponent,
	],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
  ],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
