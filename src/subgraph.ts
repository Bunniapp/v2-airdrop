import { request, Variables } from 'graphql-request';

export async function batchSubgraphData(_endpoint: string, _query: string, _variables: Variables = { }): Promise<any[]> {
  let data: any = {};
  let skip: number = 0;
  let fetch: boolean = true;

  while (fetch) {
    fetch = false;

    await request(_endpoint, _query, _variables)
      .then((_queryResult: any) => {
        Object.keys(_queryResult).forEach((key) => {
          data[key] = data[key] ? [...data[key], ..._queryResult[key]] : _queryResult[key];
        });

        Object.values(_queryResult).forEach((entry: any) => {
          if (entry && entry.length === 1000) fetch = true;
        });
      })
      .catch((_error: Error) => { 
        console.log(_error)
        data = null;
      });

    if (Object.keys(_variables).includes('first') && _variables['first'] !== undefined) break;

    skip += 1;
    _variables = { ..._variables, skip: skip * 1000 };
  }

  return data;
}