import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core'

@Component({
	selector: 'app-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
	@Output() searchEmitter: EventEmitter<string> = new EventEmitter<string>()
	@ViewChild('searchInput') searchInput!: ElementRef

	applyFilter(event: Event) {
		const value = (event.target as HTMLInputElement).value
		this.searchEmitter.emit(value.trim().toLowerCase())
	}
}
