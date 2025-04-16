import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Step02Page } from './step02.page';

describe('Step02Page', () => {
  let component: Step02Page;
  let fixture: ComponentFixture<Step02Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Step02Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
