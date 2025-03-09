import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingorderListComponent } from './pendingorder-list.component';

describe('PendingorderListComponent', () => {
  let component: PendingorderListComponent;
  let fixture: ComponentFixture<PendingorderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingorderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingorderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
