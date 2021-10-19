import { HeroComponent } from './../hero/hero.component';
import { HeroesComponent } from './heroes.component';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroService } from '../hero.service';
import { Directive, NO_ERRORS_SCHEMA, Input } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

// mocking the routerLink directive
@Directive({
  selector: '[routerLink]',
  host: {'(click)': 'onClick()'}
})
export class routerLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigateTo: any = null;

  onClick() {
    this.navigateTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent, routerLinkDirectiveStub],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService
        }
      ],
      // schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    //run ngOnInit()
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent))
    expect(heroComponentDEs.length).toBe(3);

    for(let heroIndex=0; heroIndex < heroComponentDEs.length; heroIndex++ ) {
      expect(heroComponentDEs[heroIndex].componentInstance.hero).toEqual(HEROES[heroIndex]);
    }
  });

  it(`should call HeroService.deleteHero when the HeroComponent's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    // heroComponents[0].query(By.css('button')).triggerEventHandler('click', {stopPropagation: () => {}});
    (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

  });

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const name = "Mr. Ice";
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));

    // geting the input and the add btn
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addBtn = fixture.debugElement.queryAll(By.css('button'))[0];

    // simulating writing in the #heroName text input
    inputElement.value = name;
    addBtn.triggerEventHandler('click', null);
    fixture.detectChanges(); //required if we want angular to detect the change in the input

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain('Mr. Ice');
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0]
      .query(By.directive(routerLinkDirectiveStub))
      .injector.get(routerLinkDirectiveStub);

      heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

      expect(routerLink.navigateTo).toBe('/detail/1');
  });

});
