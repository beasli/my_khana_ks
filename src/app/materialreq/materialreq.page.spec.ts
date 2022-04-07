import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReq } from './materialreq.page';

describe('MaterialReq', () => {
  let component: MaterialReq;
  let fixture: ComponentFixture<MaterialReq>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialReq ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialReq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
