import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { Router } from "@angular/router";

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
	public logoName = 'CovidYouNot'
	public signUp = 'Sign Up'
	public signIn = 'Sign In'
	public signOut = 'Sign Out'
	public currentLink = '#'

	constructor(public auth:AuthService, private router:Router) {}

	public navbarElements: any = [
		{ link: '#', name: 'Home', roles: [] },
		{ link: '#about', name: 'About Us', roles: [] },
		{ link: '#technology', name: 'Technology', roles: [] },
		{ link: '/eu', name: 'EU', roles: [] },
		{ link: '/patients', name: 'Patients', roles: ['ROLE_USER','ROLE_ADMIN']},
		{ link: '/patientstable', name: 'Patientstable', roles: ['ROLE_ADMIN']},
		{ link: '/dashboard', name: 'Dashboard', roles: ['ROLE_MEDIC']}
	]

	onClick(link: any): void {
		this.currentLink = link
	}

	signOutUser() {
		this.auth.logout();
    this.router.navigate(['/home']);
	}

	ngOnInit() {}
}
