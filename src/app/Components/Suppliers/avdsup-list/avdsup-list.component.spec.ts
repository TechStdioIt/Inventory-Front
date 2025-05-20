import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvdsupListComponent } from './avdsup-list.component';

describe('AvdsupListComponent', () => {
  let component: AvdsupListComponent;
  let fixture: ComponentFixture<AvdsupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvdsupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvdsupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
