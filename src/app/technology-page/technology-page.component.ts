import { Component } from '@angular/core'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faIoxhost } from '@fortawesome/free-brands-svg-icons'
import { faMoon } from '@fortawesome/free-regular-svg-icons'

import {
	faBarsStaggered,
	faBatteryHalf,
	faChartLine,
	faHeartPulse,
	faLightbulb,
	faLungs,
} from '@fortawesome/free-solid-svg-icons'

import { Swiper } from 'swiper'
import { register } from 'swiper/element/bundle'
// register Swiper custom elements
register()

type Tech = {
	sensor: string
	description: string
	icons: IconProp
}

@Component({
	selector: 'app-technology-page',
	templateUrl: './technology-page.component.html',
	styleUrls: ['./technology-page.component.css'],
})
export class TechnologyPageComponent {
	techs: Tech[] = [
		{
			sensor: 'Heart Rate',
			description:
				'The device constantly monitors the user’s heart rate using it’s sensor.  This is essential for getting real-time feedback on exercise intensity, assessing recovery, and understanding daily heart rate variability.',
			icons: faHeartPulse,
		},
		{
			sensor: 'Activity Tracking',
			description:
				'This feature monitors the user’s daily steps, distance traveled, floors climbed, and more. It helps ensure that users remain active throughout the day, providing them with reminders and goals to motivate movement.',
			icons: faChartLine,
		},
		{
			sensor: 'Sleep Tracking',
			description:
				'The device provided details on REM sleep stages. This information, combined with Pulse Ox and respiration data, can offer a thorough understanding of sleep quality.',
			icons: faMoon,
		},
		{
			sensor: 'Pulse OX',
			description:
				'Pulse Ox provides an estimate of the oxygen saturation level in the blood, which can be important for understanding sleep health and acclimation at high altitudes.',
			icons: faIoxhost,
		},
		{
			sensor: 'Respiration Rate',
			description:
				'By monitoring the number of breath per minute, users can understand how their breathing rate changes with sleep, stress, or physical activity',
			icons: faLungs,
		},
		{
			sensor: 'Stress Tracking',
			description:
				'By analyzing HRV, the device provides insights about the user’s stress levels throughout the day.',
			icons: faBarsStaggered,
		},
		{
			sensor: 'Body Battery',
			description:
				'This is an innovative feature that combines various metrics like heart rate variability, stress, sleep, and activity data to estimate a user’s energy levels throughout the day.',
			icons: faBatteryHalf,
		},
		{
			sensor: 'Smart Bulb',
			description:
				'A smart bulb is a wireless-controllable LED light source that offers more than just illumination. Equipped with advanced sensors and connectivity, it holds potential for innovative applications in the realm of indoor localization.',
			icons: faLightbulb,
		},
	]

	ngOnInit() {
		var swiper = new Swiper('.mySwiper', {
			spaceBetween: 30,
			centerInsufficientSlides: true,
			centeredSlides: true,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
			},
			speed: 1000,
			loop: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
		})
	}
}
