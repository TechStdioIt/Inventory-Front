import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegeionListComponent } from './regeion-list.component';

describe('RegeionListComponent', () => {
  let component: RegeionListComponent;
  let fixture: ComponentFixture<RegeionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegeionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegeionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
