import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'

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

	constructor(public auth:AuthService) {}

	public navbarElements: any = [
		{ link: '#', name: 'Home', roles: [] },
		{ link: '#about', name: 'About Us', roles: [] },
		{ link: '#technology', name: 'Technology', roles: [] },
		{ link: '/eu', name: 'EU', roles: [] },
		{ link: '/patients', name: 'Patients', roles: ['ROLE_USER']},
		{ link: '/patientstable', name: 'Patientstable', roles: []}
	]

	onClick(link: any): void {
		this.currentLink = link
	}

	signOutUser() {
		this.auth.clear();
	}

	ngOnInit() {}
}
