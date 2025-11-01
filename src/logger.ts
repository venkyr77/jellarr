export interface Logger {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
}

export const logger: Logger = {
  info: (msg: string): void => {
    console.log(msg);
  },
  warn: (msg: string): void => {
    console.warn(msg);
  },
  error: (msg: string): void => {
    console.error(msg);
  },
};
