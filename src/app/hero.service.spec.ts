import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HeroService,
        {
          provide: MessageService,
          useValue: mockMessageService
        }
      ]
    });

    // method one of injecting services
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroService);
  });

  describe('getHero', () => {

    // method two of injecting services
    it('should call getHero with the correct url', inject(
      [HeroService, HttpTestingController],
      (service: HeroService, controller: HttpTestingController) => {
        //call getHero
        service.getHero(4).subscribe(hero => {
          expect(hero.id).toBe(4);
        });

        //test that the url was correct
        const req = controller.expectOne('api/heroes/4');

        req.flush({id: 4, name: 'SuperDude', strength: 100});
        expect(req.request.method).toEqual('GET');
        controller.verify();
      }
    ));

  });


});
