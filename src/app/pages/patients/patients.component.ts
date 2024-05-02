import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { Element } from '../patients-table/patients-table.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit  {

  patientId!: number;
  patientData!: Element;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Extract patient ID from route parameters
    this.route.params.subscribe(params => {
      this.patientId = +params['id']; // Convert ID to number
      // Access ELEMENT_DATA from route state
      const patientsData: Element[] = history.state.patientsData;
      // Find patient data based on patient ID
      // @ts-ignore
      this.patientData = patientsData.find(patient => patient.id === this.patientId);
    });
  }
}
