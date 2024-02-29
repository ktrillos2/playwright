export const transformData = <T = any>(data: any) =>
  JSON.parse(JSON.stringify(data)) as T;
