/// <reference types="vite/client" />

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.JPG" {
  const src: string;
  export default src;
}
