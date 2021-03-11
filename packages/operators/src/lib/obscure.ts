import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ObscureConfig {
  skipUntil: number;
  placeholder: string;
}

const defaultConfig = {
  skipUntil: -1,
  placeholder: '*',
};

const reducer = (config: ObscureConfig) => (
  state: string,
  curr: string,
  index: number
) => state + (index <= config.skipUntil ? curr : config.placeholder);

const transformEmail = (config: ObscureConfig) => (value: string) => {
  const [username, domain] = value.split('@');
  const obscuredUsername = username.split('').reduce(reducer(config));
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
        reducer(!config ? defaultConfig : { ...defaultConfig, ...config })
      )
    );
}

export function obscureEmail(config?: ObscureConfig) {
  return (source: Observable<string>) =>
    source.pipe(
      map(
        transformEmail(
          !config ? defaultConfig : { ...defaultConfig, ...config }
        )
      )
    );
}
