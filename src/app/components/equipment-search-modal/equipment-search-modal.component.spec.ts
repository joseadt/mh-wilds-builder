import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentSearchModalComponent } from './equipment-search-modal.component';

describe('EquipmentSearchModalComponent', () => {
  let component: EquipmentSearchModalComponent;
  let fixture: ComponentFixture<EquipmentSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentSearchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
