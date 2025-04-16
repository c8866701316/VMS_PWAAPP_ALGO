import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Step01Page } from './step01.page';

describe('Step01Page', () => {
  let component: Step01Page;
  let fixture: ComponentFixture<Step01Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Step01Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
