import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AboutPageComponent } from './about-page/about-page.component'
import { EuPageComponent } from './eu-page/eu-page.component'
import { LandingPageComponent } from './landing-page/landing-page.component'
import { LoginComponent } from './login/login.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { RegisterComponent } from './register/register.component'
import { TechnologyPageComponent } from './technology-page/technology-page.component'
import { PatientsComponent } from './pages/patients/patients.component'
import { ForbiddenComponent } from './pages/forbidden/forbidden.component'
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component'
import {PatientsTableComponent} from "./pages/patients-table/patients-table.component";

const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'about', component: AboutPageComponent },
	{ path: 'technology', component: TechnologyPageComponent },
	{ path: 'eu', component: EuPageComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'patients', component: PatientsComponent},
	{ path: 'patientstable', component: PatientsTableComponent},
	{ path: 'patient-details', component: PatientDetailsComponent},
	{ path: 'forbidden', component: ForbiddenComponent},
	{ path: '**', redirectTo: '', component: PageNotFoundComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
	LandingPageComponent,
	EuPageComponent,
	LoginComponent,
	RegisterComponent,
	AboutPageComponent,
	TechnologyPageComponent,
	PageNotFoundComponent,
  ForbiddenComponent
]
