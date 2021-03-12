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

const createReducer = (config: ObscureConfig) => (
  state: string,
  curr: string,
  index: number
) => state + (index <= config.skipUntil ? curr : config.placeholder);

const transformEmail = (config: ObscureConfig) => (value: string) => {
  const [username, domain] = value.split('@');
  const obscuredUsername = username.split('').reduce(createReducer(config));
  return `${obscuredUsername}@${domain}`;
};

export const obscureWith = (
  reducerFunction: (
    previousValue: string,
    currentValue: string,
    currentIndex: number,
    array: string[]
  ) => string
) => {
  return (source: Observable<string>) =>
    source.pipe(map((value) => value.split('').reduce(reducerFunction)));
};

export function obscure(config?: ObscureConfig) {
  return (source: Observable<string>) =>
    source.pipe(
      obscureWith(
        createReducer(!config ? defaultConfig : { ...defaultConfig, ...config })
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
