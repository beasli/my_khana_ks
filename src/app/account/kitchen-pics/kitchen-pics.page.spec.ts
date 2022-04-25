import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenPicsPage } from './kitchen-pics.page';

describe('KitchenPicsPage', () => {
  let component: KitchenPicsPage;
  let fixture: ComponentFixture<KitchenPicsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenPicsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenPicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
