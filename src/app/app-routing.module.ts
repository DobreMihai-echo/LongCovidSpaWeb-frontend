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
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component'
import { authGuard } from './auth/auth.guard'
import { PrivacyCenterComponent } from './components/privacy-center/privacy-center.component'
import { MedicApplyComponent } from './pages/medic-apply/medic-apply.component'
import { MedicEmailVerifiedComponent } from './pages/medic-email-verified/medic-email-verified.component'
import { MedicPatientsComponent } from './pages/medic-patients/medic-patients.component'
import { AdminMedicApplicationComponent } from './pages/admin-medic-application/admin-medic-application.component'

const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'about', component: AboutPageComponent },
	{ path: 'technology', component: TechnologyPageComponent },
	{ path: 'eu', component: EuPageComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'patients', component: PatientsComponent, canActivate: [authGuard], data: { roles: ['ROLE_MEDIC']}},
	{ path: 'patientstable', component: PatientsTableComponent , canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
	{ path: 'patient-details', component: PatientDetailsComponent , canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
	{ path: 'forbidden', component: ForbiddenComponent},
	{ path: 'dashboard', component: UserDashboardComponent, canActivate: [authGuard], data: { roles: ['ROLE_USER'] }},
	{ path: 'privacy', component: PrivacyCenterComponent },
	{ path: 'medic/apply', component: MedicApplyComponent, canActivate:[authGuard], data:{ roles:['ROLE_USER','ROLE_MEDIC','ROLE_ADMIN'] } },
    { path: 'medic/verify-email', component: MedicEmailVerifiedComponent }, // simple thank-you page
    { path: 'medic/patients', component: MedicPatientsComponent, canActivate:[authGuard], data:{ roles:['ROLE_MEDIC'] } },
	{ path: 'medic/verify-email', component: MedicEmailVerifiedComponent },
    { path: 'admin/medics', component:AdminMedicApplicationComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }
},	{ path: '**', redirectTo: '', component: PageNotFoundComponent }
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
