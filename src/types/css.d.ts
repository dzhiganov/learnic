declare module '*.css' {
  type ClassNames = {
    readonly [className: string]: string;
  };
}
