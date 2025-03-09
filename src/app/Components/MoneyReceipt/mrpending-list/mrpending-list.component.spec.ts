import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrpendingListComponent } from './mrpending-list.component';

describe('MrpendingListComponent', () => {
  let component: MrpendingListComponent;
  let fixture: ComponentFixture<MrpendingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MrpendingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrpendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
