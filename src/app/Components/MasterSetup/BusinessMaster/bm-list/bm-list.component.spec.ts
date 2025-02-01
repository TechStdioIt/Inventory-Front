import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmListComponent } from './bm-list.component';

describe('BmListComponent', () => {
  let component: BmListComponent;
  let fixture: ComponentFixture<BmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
