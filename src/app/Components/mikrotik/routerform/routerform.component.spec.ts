import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterformComponent } from './routerform.component';

describe('RouterformComponent', () => {
  let component: RouterformComponent;
  let fixture: ComponentFixture<RouterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
