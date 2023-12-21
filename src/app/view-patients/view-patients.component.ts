import { LiveAnnouncer } from '@angular/cdk/a11y'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

export interface UserElements {
	name: string
	birthdate: Date
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
		birthdate: new Date('03-10-1990'),
		gender: 'Female',
		height: '168 cm',
		weight: '50kg',
		medicalHistory: '',
		change: '-2%',
		user: 'View',
	},
	{
		name: 'Andrei Ionescu',
		birthdate: new Date('08-09-1975'),
		gender: 'Male',
		height: '180 cm',
		weight: '80kg',
		medicalHistory: '',
		change: '+12%',
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
		// This example uses English messages. If your application supports
		// multiple language, you would internationalize these strings.
		// Furthermore, you can customize the message to add additional
		// details about the values being sorted.
		if (sortState.direction) {
			this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
		} else {
			this._liveAnnouncer.announce('Sorting cleared')
		}
	}
}
