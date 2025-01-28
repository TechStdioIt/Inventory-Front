import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMailVerifyComponent } from './register-mail-verify.component';

describe('RegisterMailVerifyComponent', () => {
  let component: RegisterMailVerifyComponent;
  let fixture: ComponentFixture<RegisterMailVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMailVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMailVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
