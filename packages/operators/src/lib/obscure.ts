import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export interface ObscureConfig {
  skipUntil: number;
  placeholder: string;
}

export const defaultConfig = {
  skipUntil: -1,
  placeholder: '*',
};

export const transformFactory = (config: ObscureConfig) => (
  acc: string,
  char: string,
  index: number
) => acc + (index <= config.skipUntil ? char : config.placeholder);
('');

export const obscureWith = (
  transformFunction: (
    previousValue: string,
    currentValue: string,
    currentIndex: number,
    array: string[]
  ) => string
) => {
  return (source: Observable<string>) =>
    source.pipe(map((value) => value.split('').reduce(transformFunction)));
};

export function obscure(): (source: Observable<string>) => Observable<string>;
export function obscure(
  config: ObscureConfig
): (source: Observable<string>) => Observable<string>;
export function obscure(config?: ObscureConfig) {
  if (config) {
    return (source: Observable<string>) =>
      source.pipe(
        obscureWith(transformFactory({ ...defaultConfig, ...config }))
      );
  } else {
    return (source: Observable<string>) =>
      source.pipe(obscureWith(transformFactory(defaultConfig)));
  }
}

export function obscureEmail(): (
  source: Observable<string>
) => Observable<string>;
export function obscureEmail(
  config: ObscureConfig
): (source: Observable<string>) => Observable<string>;
export function obscureEmail(config?: ObscureConfig) {
  if (config) {
    return (source: Observable<string>) =>
      source.pipe(
        mergeMap((value) => {
          const [username, domain] = value.split('@');
          return of(username).pipe(
            obscure(config),
            map((obscuredUsername) => `${obscuredUsername}@${domain}`)
          );
        })
      );
  } else {
    return (source: Observable<string>) =>
      source.pipe(
        mergeMap((value) => {
          const [username, domain] = value.split('@');
          return of(username).pipe(
            obscure(),
            map((obscuredUsername) => `${obscuredUsername}@${domain}`)
          );
        })
      );
  }
}
