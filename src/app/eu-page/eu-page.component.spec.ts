import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuPageComponent } from './eu-page.component';

describe('EuPageComponent', () => {
  let component: EuPageComponent;
  let fixture: ComponentFixture<EuPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
