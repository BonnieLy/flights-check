import axios from 'axios';

export default class BaseApi {
  /**
   * 
   * @param {string} url 
   * @param {Object} cache 
   * @param {AxiosRequestConfig} config 
   * @returns {Promise<*>}
   */
  static get(url, cache = undefined, config = undefined) {
    return this.request('get', url, cache, undefined, config);
  }

  /**
   * 
   * @param {'get'} method 
   * @param {string} url 
   * @param {Object} cache 
   * @param {any} data 
   * @param {AxiosRequestConfig} config 
   * @returns {Promise<*>}
   */
  static request(method, url, cache = undefined, data = undefined, config = undefined) {
    // if the data is in the localStorage, return it
    if (cache) {
      const cachedValue = this.getCache(cache.key, cache.code);

      if (cachedValue) return cachedValue;
    }

    // otherwise make request and add it to the localStorage
    return axios.request({
      method,
      url,
      data,
      baseURL: import.meta.env.VITE_AIR_LABS_API_BASE_URL,
      ...config,
      params: {
        ...config?.params,
        api_key: import.meta.env.VITE_AIR_LABS_API_KEY
      },
    })
      .then(({ data }) => {
        if (data.error) throw data.error;
        if (cache) this.setCache(cache.key, cache.code, data.response);

        return data.response;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * We store the data in the localStorage in two ways:
   * 1. { key: data }. For example: { 'airports': [{ 'name': 'A' }] }
   * 2. { key: { code1: data, code2: data }}. For example: { 'cities': { 'SYD': [{ 'name': 'Sydney' }] } }
   * 
   * @param {string} key 
   * @param {string} code 
   * @returns {null | any}
   */
  static getCache(key, code) {
    const item = JSON.parse(localStorage.getItem(key));

    if (!item) return null;
    if (!code) return item;
    if (!item.hasOwnProperty(code)) return null;

    return item[code];
  }

  /**
   * Cache the data in either way 1 or way 2
   * 
   * @param {string} key 
   * @param {string} code 
   * @param {any} data
   */
  static setCache(key, code, data) {
    // if it is way 1
    if (!code) {
      localStorage.setItem(key, JSON.stringify(data));
      return;
    }

    // if it is way 2 but its key does not exist
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify({ [code]: data }));
      return;
    }

    // if it is way 2 and its key is already cached
    const newValue = JSON.parse(localStorage.getItem(key));
    newValue[code] = data;
    localStorage.setItem(key, JSON.stringify(newValue));
  }
}