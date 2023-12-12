import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AboutPageComponent } from './about-page/about-page.component'
import { AppRoutingModule, routingComponents } from './app-routing.module'
import { AppComponent } from './app.component'
import { FooterPageComponent } from './footer-page/footer-page.component'
import { GeneralLayoutComponent } from './general-layout/general-layout.component'
import { NavbarComponent } from './navbar/navbar.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { TechnologyPageComponent } from './technology-page/technology-page.component'
import { ViewPatientsComponent } from './view-patients/view-patients.component'

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
		ViewPatientsComponent,
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
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
