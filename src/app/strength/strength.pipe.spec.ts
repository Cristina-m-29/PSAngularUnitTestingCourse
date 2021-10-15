import { StrengthPipe } from './strength.pipe';

describe('StrengthPipe', () => {

  it('should display weak if strength is 5', () => {
    const pipe = new StrengthPipe();

    const val = pipe.transform(5);

    expect(val).toEqual('5 (weak)')
  });

  it('should display strong if strength is 10', () => {
    const pipe = new StrengthPipe();

    const val = pipe.transform(10);

    expect(val).toEqual('10 (strong)');
  });

  it('should display unbelievable if strength is 21', () => {
    const pipe = new StrengthPipe();

    const val = pipe.transform(21);

    expect(val).toEqual('21 (unbelievable)');
  });

});
