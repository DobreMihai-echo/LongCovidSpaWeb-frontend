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
	public currentLink = '#'

	constructor(public auth:AuthService) {}

	public navbarElements: any = [
		{ link: '#', name: 'Home', roles: [] },
		{ link: '#about', name: 'About Us', roles: [] },
		{ link: '#technology', name: 'Technology', roles: [] },
		{ link: '/eu', name: 'EU', roles: [] },
		{ link: '/login', name: 'Sign In', roles: [] },
		{ link: '/patients', name: 'Patients', roles: ['ROLE_USER','ROLE_ADMIN']}
	]

	onClick(link: any): void {
		this.currentLink = link
	}

	ngOnInit() {}
}
