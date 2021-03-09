import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

const transformEmailFactory = (config: ObscureConfig) => (value: string) => {
  const [username, domain] = value.split('@');
  const obscuredUsername = username.split('').reduce(transformFactory(config));
  return `${obscuredUsername}@${domain}`;
};

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

export function obscure(config?: ObscureConfig) {
  return (source: Observable<string>) =>
    source.pipe(
      obscureWith(
        transformFactory(
          !config ? defaultConfig : { ...defaultConfig, ...config }
        )
      )
    );
}

export function obscureEmail(config?: ObscureConfig) {
  return (source: Observable<string>) =>
    source.pipe(
      map(
        transformEmailFactory(
          !config ? defaultConfig : { ...defaultConfig, ...config }
        )
      )
    );
}
