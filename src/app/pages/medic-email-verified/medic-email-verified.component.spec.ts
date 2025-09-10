import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicEmailVerifiedComponent } from './medic-email-verified.component';

describe('MedicEmailVerifiedComponent', () => {
  let component: MedicEmailVerifiedComponent;
  let fixture: ComponentFixture<MedicEmailVerifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicEmailVerifiedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicEmailVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
