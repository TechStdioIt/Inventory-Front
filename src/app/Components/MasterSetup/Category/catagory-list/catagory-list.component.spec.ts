import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryListComponent } from './catagory-list.component';

describe('CatagoryListComponent', () => {
  let component: CatagoryListComponent;
  let fixture: ComponentFixture<CatagoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatagoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatagoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
