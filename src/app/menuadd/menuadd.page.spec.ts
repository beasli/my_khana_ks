import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdd } from './menuadd.page';

describe('MaterialReq', () => {
  let component: MenuAdd;
  let fixture: ComponentFixture<MenuAdd>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAdd ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
