import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CicoComponent } from './cico.component';

describe('CicoComponent', () => {
  let component: CicoComponent;
  let fixture: ComponentFixture<CicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
