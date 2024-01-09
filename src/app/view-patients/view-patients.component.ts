import { LiveAnnouncer } from '@angular/cdk/a11y'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'

export interface UserElements {
	name: string
	birthdate: string
	gender: string
	height: string
	weight: string
	medicalHistory: string
	change: string
	user: string
}
const SORT_ELEMENTS: UserElements[] = [
	{
		name: 'Maria Popescu',
		birthdate: '03-10-1990',
		gender: 'Female',
		height: '168 cm',
		weight: '50kg',
		medicalHistory: '',
		change: '-2%',
		user: 'View',
	},
	{
		name: 'Andrei Ionescu',
		birthdate: '20-11-1998',
		gender: 'Male',
		height: '180 cm',
		weight: '80kg',
		medicalHistory: '',
		change: '+12%',
		user: '',
	},
	{
		name: 'Marian Popa',
		birthdate: '09-08-1975',
		gender: 'Male',
		height: '187 cm',
		weight: '75kg',
		medicalHistory: '',
		change: '-3%',
		user: '',
	},
	{
		name: 'Andreea Stanciu',
		birthdate: '03-10-2000',
		gender: 'Male',
		height: '173 cm',
		weight: '60kg',
		medicalHistory: '',
		change: '+5%',
		user: '',
	},
]

@Component({
	selector: 'app-view-patients',
	templateUrl: './view-patients.component.html',
	styleUrls: ['./view-patients.component.css'],
})
export class ViewPatientsComponent implements AfterViewInit {
	[x: string]: any
	displayedColumns: string[] = [
		'name',
		'birthdate',
		'gender',
		'height',
		'weight',
		'medicalHistory',
		'change',
		'user',
	]
	dataSource = new MatTableDataSource(SORT_ELEMENTS)

	constructor(private _liveAnnouncer: LiveAnnouncer) {}

	@ViewChild(MatSort)
	sort: MatSort = new MatSort()

	ngAfterViewInit() {
		this.dataSource.sort = this.sort
	}

	/** Announce the change in sort state for assistive technology. */
	announceSortChange(sortState: Sort) {
		if (sortState.direction) {
			this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
		} else {
			this._liveAnnouncer.announce('Sorting cleared')
		}
	}

	performSearch(value: string) {
		console.log('Performing search:', value)
	}
}
