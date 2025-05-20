import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterlistComponent } from './routerlist.component';

describe('RouterlistComponent', () => {
  let component: RouterlistComponent;
  let fixture: ComponentFixture<RouterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
