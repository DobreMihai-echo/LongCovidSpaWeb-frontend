import { Component } from '@angular/core'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

@Component({
	selector: 'app-landing-page',
	templateUrl: './landing-page.component.html',
	styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
	faCircle = faCircle
	faChevronDown = faChevronDown
}
