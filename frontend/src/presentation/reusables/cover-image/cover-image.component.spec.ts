import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverImageComponent } from './cover-image.component';

describe('CoverImageComponent', () => {
  let component: CoverImageComponent;
  let fixture: ComponentFixture<CoverImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
