import BaseApi from './BaseApi';

export default class FlightApi extends BaseApi {
  static getAirports() {
    return this.get('/airports', null, {
      params: {
        country_code: 'AU',
        _fields: 'name,icao_code,is_major,iata_code',
      }
    });
  }

  /**
   * 
   * @param {string} dep_iata 
   * @returns {Promise<*>}
   */
  static getDepartures(dep_iata) {
    return this.get('/schedules', null, {
      params: {
        dep_iata,
        _fields: 'status,airline_iata,airline_icao,flight_number,flight_icao,flight_iata,dep_time,arr_time,arr_iata,arr_icao',
      }
    });
  }

  /**
   * 
   * @param {string} arr_iata 
   * @returns {Promise<*>}
   */
  static getArrivals(arr_iata) {
    return this.get('/schedules', null, {
      params: {
        arr_iata,
        _fields: 'status,airline_iata,airline_icao,flight_number,flight_icao,flight_iata,dep_time,arr_time,dep_iata,dep_icao',
      }
    });
  }

  /**
   * 
   * @param {string} flight_icao 
   * @param {string} flight_iata 
   * @returns {Promise<*>}
   */
  static getDetails(flight_icao, flight_iata) {
    return this.get('/flight', null, {
      params: {
        flight_icao,
        flight_iata,
      }
    });
  }

  /**
   * 
   * @param {string} iata_code 
   * @param {string} icao_code 
   * @returns {Promise<*>}
   */
  static getAirline(iata_code, icao_code) {
    return this.get('/airlines', {
      key: 'airlines',
      code: iata_code ?? icao_code,
    }, {
      params: {
        iata_code,
        icao_code,
        _fields: 'name,country_code',
      }
    });
  }

  /**
   * 
   * @param {string} city_code 
   * @returns {Promise<*>}
   */
  static getCity(city_code) {
    return this.get('/cities', {
      key: 'cities',
      code: city_code,
    }, {
      params: {
        city_code,
        _fields: 'name,city_code,country_code,timezone',
      }
    });
  }

  /**
   * 
   * @param {string} code 
   * @returns {Promise<*>}
   */
  static getCountry(code) {
    return this.get('/countries', {
      key: 'countries',
      code: code,
    }, {
      params: {
        code,
        _fields: 'name,code,code3',
      }
    });
  }
}