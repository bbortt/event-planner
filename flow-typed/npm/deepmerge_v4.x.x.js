// flow-typed signature: 9bbb9417106d52f3eb40d928509135f3
// flow-typed version: c2580add5a/deepmerge_v4.x.x/flow_>=v0.83.x

declare module 'deepmerge' {
  declare type Options = {
    clone?: boolean,
    arrayMerge?: (destination: any[], source: any[], options?: Options) => Array<any>,
    isMergeableObject?: (value: { ... }) => boolean,
    customMerge?: (key: string, options?: Options) => ((x: any, y: any) => any) | void,
    ...
  };

  declare module.exports: {
    <A, B>(a: A, b: B, options?: Options): A & B,
    all<T>(objects: Array<$Shape<T>>, options?: Options): T,
    ...
  };
}
