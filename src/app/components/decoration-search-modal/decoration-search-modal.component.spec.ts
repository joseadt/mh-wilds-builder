import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorationSearchModalComponent } from './decoration-search-modal.component';

describe('DecorationSearchModalComponent', () => {
  let component: DecorationSearchModalComponent;
  let fixture: ComponentFixture<DecorationSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecorationSearchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecorationSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
