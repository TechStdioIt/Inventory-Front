import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceivedFormComponent } from './goods-received-form.component';

describe('GoodsReceivedFormComponent', () => {
  let component: GoodsReceivedFormComponent;
  let fixture: ComponentFixture<GoodsReceivedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsReceivedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReceivedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
