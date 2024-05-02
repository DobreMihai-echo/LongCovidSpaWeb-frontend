import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {Router} from '@angular/router';



export interface Element {
  id: number;
  position: number;
  name: string;
  birthday: string;
  gender: string;
  height: number;
  weight: number;
  medicalHistory: string;
  change: string;
}

const ELEMENT_DATA: Element[] = [
  { id: 1, position: 1, name: 'Pacient1', birthday: '01/01/2000', gender: 'Male', height: 180, weight: 80, medicalHistory: 'High Blood Pressure', change: "-2" },
  { id: 2, position: 2, name: 'Pacient2', birthday: '01/01/2000', gender: 'F', height: 180, weight: 80, medicalHistory: 'High Blood Pressure', change: "2" },
  { id: 3, position: 3, name: 'Pacient3', birthday: '01/01/2000', gender: 'Male', height: 162, weight: 80, medicalHistory: 'High Blood Pressure', change: "-4" },
  { id: 4,position: 4, name: 'Pacient4', birthday: '01/01/2000', gender: 'Male', height: 180, weight: 80, medicalHistory: 'High Blood Pressure', change: "-6" },
];

@Component({
  selector: 'app-patients-table',
  templateUrl: './patients-table.component.html',
  styleUrls: ['./patients-table.component.css']
  // imports: [MatTableModule, MatSortModule],
})
export class PatientsTableComponent {

  constructor(private router: Router) { }

  public logoName = 'CovidYouNot'

  displayedColumns: string[] = ['position', 'name', 'birthday', 'gender', 'height', 'weight', 'medicalHistory', 'change', 'view'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  viewPatientDetails(patientId: number) {
    this.router.navigate(['/patients', patientId], { state: { patientsData: ELEMENT_DATA }});
    }
}
