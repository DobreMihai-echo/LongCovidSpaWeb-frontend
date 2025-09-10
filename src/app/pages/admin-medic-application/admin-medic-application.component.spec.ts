import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMedicApplicationComponent } from './admin-medic-application.component';

describe('AdminMedicApplicationComponent', () => {
  let component: AdminMedicApplicationComponent;
  let fixture: ComponentFixture<AdminMedicApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMedicApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMedicApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
