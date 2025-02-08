import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceivedListComponent } from './goods-received-list.component';

describe('GoodsReceivedListComponent', () => {
  let component: GoodsReceivedListComponent;
  let fixture: ComponentFixture<GoodsReceivedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsReceivedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReceivedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
