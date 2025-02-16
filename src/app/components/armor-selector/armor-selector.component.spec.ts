import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmorSelectorComponent } from './armor-selector.component';

describe('ArmorSelectorComponent', () => {
    let component: ArmorSelectorComponent;
    let fixture: ComponentFixture<ArmorSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArmorSelectorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArmorSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
