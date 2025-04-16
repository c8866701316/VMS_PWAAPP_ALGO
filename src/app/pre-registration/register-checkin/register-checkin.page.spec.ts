import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCheckinPage } from './register-checkin.page';

describe('RegisterCheckinPage', () => {
  let component: RegisterCheckinPage;
  let fixture: ComponentFixture<RegisterCheckinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCheckinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
