import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcRequestListComponent } from './lc-request-list.component';

describe('LcRequestListComponent', () => {
  let component: LcRequestListComponent;
  let fixture: ComponentFixture<LcRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
