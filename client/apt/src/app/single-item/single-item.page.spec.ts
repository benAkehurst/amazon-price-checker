import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleItemPage } from './single-item.page';

describe('SingleItemPage', () => {
  let component: SingleItemPage;
  let fixture: ComponentFixture<SingleItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
