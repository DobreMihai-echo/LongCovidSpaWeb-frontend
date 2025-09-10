import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicApplyComponent } from './medic-apply.component';

describe('MedicApplyComponent', () => {
  let component: MedicApplyComponent;
  let fixture: ComponentFixture<MedicApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
