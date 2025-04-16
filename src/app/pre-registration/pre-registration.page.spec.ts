import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreRegistrationPage } from './pre-registration.page';

describe('PreRegistrationPage', () => {
  let component: PreRegistrationPage;
  let fixture: ComponentFixture<PreRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
