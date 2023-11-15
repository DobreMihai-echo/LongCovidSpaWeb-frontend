import { Component } from '@angular/core'

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
	public logoName = 'CovidYouNot'
	public signUp = 'Sign Up'
	public currentLink = '#'

	public navbarElements: any = [
		{ link: '#', name: 'Home' },
		{ link: '#about', name: 'About Us' },
		{ link: '#technology', name: 'Technology' },
		{ link: '/eu', name: 'EU' },
		{ link: '/login', name: 'Sign In' },
	]

	onClick(link: any): void {
		this.currentLink = link
	}

	ngOnInit() {}
}
