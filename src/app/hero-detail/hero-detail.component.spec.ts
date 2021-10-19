import { FormsModule } from '@angular/forms';
import { HeroService } from './../hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

describe('HeroDetailComponent', () => {
  let mockActivetedRoute, mockHeroService, mockLocation;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(() => {
    mockActivetedRoute = {
      snapshot: {
        paramMap: { get: () => '3' }
      }
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivetedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 100 }));

  });

  it('should render the hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
  });

});
