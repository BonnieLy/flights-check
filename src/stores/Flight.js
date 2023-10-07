import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import FlightApi from '@/api/FlightApi';

export const RESULT_PER_PAGE = 10;

export const isLoading = ref(false);
export const airports = ref(null);
export const selected = ref(null);
export const details = ref(null);
export const allFlights = ref(null); // store all the flights
export const filteredFlights = ref(null); // store the filtered flights
export const flights = ref(null); // store the paginated flights
export const page = ref(null);
export const lastPage = ref(null);
export const filters = ref(null);
export const headers = ref({
  'arrival': [{
    'title': 'Departure Time',
    'sortBy': 'dep_time',
    'sortOrder': true,
  }, {
    'title': 'Arrival Time',
    'sortBy': 'arr_time',
    'sortOrder': true,
  }, {
    'title': 'Origin',
    'sortBy': 'dep_iata',
    'sortOrder': true,
  }, {
    'title': 'Status',
    'sortBy': 'status',
    'sortOrder': true,
  }],
  'departure': [{
    'title': 'Arrival Time',
    'sortBy': 'arr_time',
    'sortOrder': true,
  }, {
    'title': 'Departure Time',
    'sortBy': 'dep_time',
    'sortOrder': true,
  }, {
    'title': 'Departure',
    'sortBy': 'arr_iata',
    'sortOrder': true,
  }, {
    'title': 'Status',
    'sortBy': 'status',
    'sortOrder': true,
  }],
});

export const currentSort = ref({
  'arrival': headers.value['arrival'][0],
  'departure': headers.value['departure'][0],
});

const _debouncer = ref(null);

/**
 * 
 * @param {string} date 
 * @returns {string}
 */
export function convertDate(date) {
  return new Date(date).toLocaleString('en-AU');
}

/**
 * 
 * @param {string} date 
 * @returns {string}
 */
export function convertTime(date) {
  return new Date(date).toLocaleTimeString();
}

/**
 * 
 * @param {number} minutes 
 * @returns {string}
 */
export function convertToDHM(minutes) {
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  const m = minutes % 60;

  return `${d ? d + 'd ' : ''}${d || h ? h + 'h ' : ''}${m ? m + 'm' : ''}`;
}

/**
 * 
 * @param {any} cb 
 * @param {number} timeout 
 */
export function debouncer(cb, timeout = 300) {
  clearTimeout(_debouncer.value);

  _debouncer.value = setTimeout(() => {
    cb();
  }, timeout);
}

export async function getAirports() {
  try {
    reset();
    isLoading.value = true;

    if (localStorage.getItem('airports')) {
      airports.value = JSON.parse(localStorage.getItem('airports'));
    } else {
      const data = await FlightApi.getAirports();
      airports.value = data.filter(a => a.is_major);
      localStorage.setItem('airports', JSON.stringify(airports.value));
    }

    isLoading.value = false;
  } catch (error) {
    errorMessage('get airports', error);
  }
}

export async function getAll() {
  try {
    reset();
    isLoading.value = true;

    const [departures, arrivals] = await Promise.all([
      FlightApi.getDepartures(selected.value),
      FlightApi.getArrivals(selected.value),
    ]);

    allFlights.value.departure = getTodayFlights(departures, 'dep_time');
    allFlights.value.arrival = getTodayFlights(arrivals, 'arr_time');

    filteredFlights.value = { ...allFlights.value };

    lastPage.value.departure = Math.ceil(filteredFlights.value.departure.length / RESULT_PER_PAGE);
    lastPage.value.arrival = Math.ceil(filteredFlights.value.arrival.length / RESULT_PER_PAGE);

    sortBy('departure', 'dep_time', true);
    sortBy('arrival', 'arr_time', true);

    isLoading.value = false;
  } catch (error) {
    errorMessage('get flights', error);
  }
}

/**
 * 
 * @param {'departure | arrival'} type 
 * @param {string} by 
 * @param {true | false} order true for acs, false for des
 */
export function sortBy(type, by, order) {
  filteredFlights.value[type].sort((a, b) => order ? a[by].localeCompare(b[by]) : b[by].localeCompare(a[by]));

  // After sorting, go back to the first page again
  getByPage(type);
}

/**
 * 
 * @param {'departure | arrival'} type 
 * @param {number} p 
 */
export function getByPage(type, p = 1) {
  page.value[type] = p;
  flights.value[type] = filteredFlights.value[type].slice((p - 1) * RESULT_PER_PAGE, p * RESULT_PER_PAGE);
}

/**
 * 
 * @param {'departure | arrival'} type 
 */
export function filterFlights(type) {
  filteredFlights.value[type] = allFlights.value[type].filter((flight) =>
    Object.entries(filters.value).every(([field, filter]) => {
      if (!filter.query) return true;
      if (!flight.hasOwnProperty(field)) return true;
      if (!flight[field]) return false;

      return (flight[field].toLowerCase()).includes(filter.query.toLowerCase());
    })
  );

  // Recalculate the last page and sort the data with the last set sort
  lastPage.value[type] = Math.ceil(filteredFlights.value[type].length / RESULT_PER_PAGE);
  sortBy(type, currentSort.value[type].sortBy, currentSort.value[type].sortOrder);
}

/**
 * Sometimes the details from the schedules API and the flights API are different (e.g., dep_time)
 * 
 * @param {string} flight_icao 
 * @param {string} flight_iata 
 */
export async function getDetails(flight_icao, flight_iata) {
  if (!flight_icao && !flight_iata) {
    errorMessage('get the flight details because the codes are missing');
    return;
  }

  try {
    const data = await FlightApi.getDetails(flight_icao, flight_iata);

    const [airline, depCity, arrCity] = await Promise.all([
      FlightApi.getAirline(data.airline_iata, data.airline_icao),
      FlightApi.getCity(data.dep_iata),
      FlightApi.getCity(data.arr_iata),
    ]);

    const [depCountry, arrCountry] = await Promise.all([
      FlightApi.getCountry(depCity[0].country_code),
      FlightApi.getCountry(arrCity[0].country_code),
    ]);

    data['airline'] = airline[0];
    data['dep_city'] = depCity[0];
    data['arr_city'] = arrCity[0];
    data['dep_country'] = depCountry[0];
    data['arr_country'] = arrCountry[0];
    data['duration_dhm'] = convertToDHM(data['duration']);

    details.value = data;
  } catch (error) {
    errorMessage('get the flight details', error);
  }
}

/**
 * 
 * @param {string} message 
 * @param {Error} error 
 * @returns {Promise<Swal>}
 */
export function errorMessage(message, error = undefined) {
  return Swal.fire(
    'Oops',
    error?.message ?? `Sorry, we are unable to ${message}. Please try again!`,
    'error'
  );
}

/**
 * 
 * @param {Array} flights 
 * @param {string} filterBy 
 * @returns {Array}
 */
function getTodayFlights(flights, filterBy) {
  const endOfDate = new Date();
  endOfDate.setHours(23);
  endOfDate.setMinutes(59);
  endOfDate.setSeconds(59);

  return flights.filter(flight => new Date(flight[filterBy]) <= endOfDate);
}

function reset() {
  allFlights.value = { 'arrival': null, 'departure': null };
  filteredFlights.value = { 'arrival': null, 'departure': null };
  flights.value = { 'arrival': null, 'departure': null };
  page.value = { 'arrival': 1, 'departure': 1 };
  lastPage.value = { 'arrival': 0, 'departure': 0 };
  filters.value = {
    'airline_iata': {
      label: 'By Airline (2-character code)',
      placeholder: 'Example: BA',
      query: '',
    },
    'airline_icao': {
      label: 'By Airline (3-character code)',
      placeholder: 'Example: BAW',
      query: '',
    },
    'flight_number': {
      label: 'By Flight Number',
      placeholder: 'Example: 1234',
      query: '',
    },
    'arr_iata': {
      label: 'By Destination (For Departures only)',
      placeholder: 'Example: SYD',
      query: '',
    },
    'dep_iata': {
      label: 'By Origin (For Arrivals only)',
      placeholder: 'Example: MEL',
      query: '',
    },
    'status': {
      label: 'By Status',
      placeholder: 'Example: active, landed, scheduled, canceled',
      query: '',
      type: 'select',
      options: ['Active', 'Landed', 'Scheduled', 'Canceled'],
    }
  };
}

watch(selected, async () => {
  if (!selected.value) return;

  await getAll();
});