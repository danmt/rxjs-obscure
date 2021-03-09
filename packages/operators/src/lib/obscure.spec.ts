import { obscure, obscureEmail } from './obscure';
import { of } from 'rxjs';

describe('Obscure Operators', () => {
  const name = 'daniel';
  const email = 'daniel@mail.com';

  describe('obscure', () => {
    it('should work without config', (done) => {
      of(name)
        .pipe(obscure())
        .subscribe((value) => {
          expect(value).toBe('d*****');
          done();
        });
    });

    it('should work with config', (done) => {
      of(name)
        .pipe(obscure({ skipUntil: 1, placeholder: '-' }))
        .subscribe((value) => {
          expect(value).toBe('da----');
          done();
        });
    });
  });

  describe('obscureEmail', () => {
    it('should work without config', (done) => {
      of(email)
        .pipe(obscureEmail())
        .subscribe((value) => {
          expect(value).toBe('d*****@mail.com');
          done();
        });
    });

    it('should work with config', (done) => {
      of(email)
        .pipe(obscureEmail({ skipUntil: 1, placeholder: '-' }))
        .subscribe((value) => {
          expect(value).toBe('da----@mail.com');
          done();
        });
    });
  });
});
