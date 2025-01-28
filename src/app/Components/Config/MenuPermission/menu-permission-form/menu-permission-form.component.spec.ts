import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPermissionFormComponent } from './menu-permission-form.component';

describe('MenuPermissionFormComponent', () => {
  let component: MenuPermissionFormComponent;
  let fixture: ComponentFixture<MenuPermissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPermissionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPermissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
