import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyCenterComponent } from './privacy-center.component';

describe('PrivacyCenterComponent', () => {
  let component: PrivacyCenterComponent;
  let fixture: ComponentFixture<PrivacyCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
