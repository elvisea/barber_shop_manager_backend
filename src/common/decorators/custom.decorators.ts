import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }) => value === 'true');
}

export function ToNumber() {
  return Transform(({ value }) =>
    value !== undefined ? Number(value) : undefined,
  );
}
