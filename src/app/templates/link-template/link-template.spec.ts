import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkTemplate } from './link-template';

describe('LinkTemplate', () => {
  let component: LinkTemplate;
  let fixture: ComponentFixture<LinkTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
