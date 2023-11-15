import { Component } from '@angular/core'
import { Swiper } from 'swiper'
import { register } from 'swiper/element/bundle'
// register Swiper custom elements
register()

@Component({
	selector: 'app-about-page',
	templateUrl: './about-page.component.html',
	styleUrls: ['./about-page.component.css'],
})
export class AboutPageComponent {
	ngOnInit() {
		var swiper = new Swiper('.slide-content', {
			slidesPerView: 3,
			centeredSlides: false,
			spaceBetween: 25,
			slidesPerGroup: 3,
			fadeEffect: {
				crossFade: true,
			},
			grabCursor: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				type: 'bullets',
				dynamicBullets: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			breakpoints: {
				0: {
					slidesPerView: 1,
					slidesPerGroup: 1,
				},
				990: {
					slidesPerView: 2,
					slidesPerGroup: 2,
				},
				1200: {
					slidesPerView: 3,
					slidesPerGroup: 3,
				},
			},
		})
	}
}
