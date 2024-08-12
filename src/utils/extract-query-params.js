/**
 *
 * @param {string} query
 */
export function extractQueryParams(query) {
  return query
    .substring(1)
    .split("&")
    .reduce((queryParams, param) => {
      const [key, value] = param.split("=");

      if (key in queryParams) {
        queryParams[key] = [...queryParams[key], value];
      } else {
        queryParams[key] = value;
      }

      return queryParams;
    }, {});
}
