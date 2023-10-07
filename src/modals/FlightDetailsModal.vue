<template>
  <div class="flight-details-modal-container" v-if="isOpen" @click.self="close">
    <div class="modal-content">
      <img class="close-button" src="@assets/cross_circle.svg" @click="close" />

      <template v-if="!details">
        <div class="loading-container">
          <p class="bold">FETCHING THE FLIGHT DATA... PLEASE WAIT...</p>
          <img src="@assets/loading.gif"/>
        </div>
      </template>

      <template v-else>
        <h1 class="flight-information-text">Flight information</h1>

        <div class="flight-status-container" :class="'status-' + details.status">
          <div>{{ details.status }}</div>
        </div>

        <table class="flight-information-container" width="100%">
          <thead>
            <th width="40%"><img class="icon-header" src="@assets/departure.svg" /></th>
            <th><img class="icon-header" src="@assets/arrow_right.svg" /></th>
            <th width="40%"><img class="icon-header" src="@assets/arrival.svg" /></th>
          </thead>

          <tbody>
            <tr>
              <td class="bold">{{ convertDate(details.dep_time) }}</td>
              <td>{{ details.duration_dhm }}</td>
              <td class="bold">{{ convertDate(details.arr_time) }}</td>
            </tr>

            <tr>
              <td>({{ details.dep_city.name }}, {{ details.dep_country.name }})</td>
              <td></td>
              <td>({{ details.arr_city.name }}, {{ details.arr_country.name }})</td>
            </tr>

            <tr>
              <td class="bold">{{ details.dep_name }} </td>
              <td></td>
              <td class="bold">{{ details.arr_name }}</td>
            </tr>

            <tr>
              <td colspan="3">
                <hr>
              </td>
            </tr>

            <tr>
              <td class="bold">Actual departure time</td>
              <td></td>
              <td class="bold">Actual arrival time</td>
            </tr>

            <tr>
              <td :class="{ 'is-empty': !details.dep_actual }">
                {{ displayText('dep_actual', 'date') }}
              </td>
              <td></td>
              <td :class="{ 'is-empty': !details.arr_actual }">
                {{ displayText('arr_actual', 'date') }}
              </td>
            </tr>

            <tr>
              <td class="bold">Terminal</td>
              <td></td>
              <td class="bold">Terminal</td>
            </tr>

            <tr>
              <td :class="{ 'is-empty': !details.dep_terminal }">{{ displayText('dep_terminal') }}</td>
              <td></td>
              <td :class="{ 'is-empty': !details.arr_terminal }">{{ displayText('arr_terminal') }}</td>
            </tr>

            <tr>
              <td class="bold">Gate</td>
              <td></td>
              <td class="bold">Gate</td>
            </tr>

            <tr>
              <td :class="{ 'is-empty': !details.dep_gate }">{{ displayText('dep_gate') }}</td>
              <td></td>
              <td :class="{ 'is-empty': !details.arr_gate }">{{ displayText('arr_gate') }}</td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td class="bold">Baggage</td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td :class="{ 'is-empty': !details.arr_baggage }">{{ displayText('arr_baggage') }}</td>
            </tr>
          </tbody>
        </table>

        <h1>Other information</h1>

        <table class="other-information-container">
          <template v-for="detail of data" class="detail-item">
            <template v-if="details[detail.field]">
              <tr>
                <td>{{ detail.title }}</td>
                <td>{{ details[detail.field] }}</td>
              </tr>
            </template>
          </template>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { details, convertDate, getDetails } from '@/stores/Flight';

const isOpen = ref(false);

// show other flight data dynamically 
const data = ref([{
  'title': 'Airline',
  'field': 'airline_name',
}, {
  'title': 'Flight Number (IATA)',
  'field': 'flight_iata',
}, {
  'title': 'Flight Number (ICAO)',
  'field': 'flight_icao',
}, {
  'title': 'Aircraft Registration Number',
  'field': 'reg_number',
}, {
  'title': 'Aircraft ICAO',
  'field': 'aircraft_icao',
}, {
  'title': 'Aircraft Geo-Latitude for now',
  'field': 'lat',
}, {
  'title': 'Aircraft Geo-Longitude for now',
  'field': 'lng',
}, {
  'title': 'Aircraft elevation for now (meters)',
  'field': 'alt',
}, {
  'title': 'Aircraft head direction for now',
  'field': 'dir',
}, {
  'title': 'Aircraft horizontal speed (km) for now',
  'field': 'speed',
}, {
  'title': 'Aircraft vertical speed (km) for now',
  'field': 'v_speed',
}, {
  'title': 'Aircraft squawk signal code',
  'field': 'squawk',
}, {
  'title': 'Aircraft full model name',
  'field': 'model',
}, {
  'title': 'Aircraft manufacturer name',
  'field': 'manufacturer',
}, {
  'title': 'Manufacturer serial number',
  'field': 'msn',
}, {
  'title': 'Aircraft type',
  'field': 'type',
}, {
  'title': 'Aircraft engine type',
  'field': 'engine',
}, {
  'title': 'Aircraft engine number',
  'field': 'engine_count',
}, {
  'title': 'Aircraft built year',
  'field': 'built',
}, {
  'title': 'Aircraft age (years)',
  'field': 'age',
}]);

/**
 * 
 * @param {string} field 
 * @param {'string' | 'date'} type 
 */
function displayText(field, type = 'string') {
  if (!details.value[field]) return 'No data.';

  return type === 'date' ? convertDate(details.value[field]) : details.value[field];
}

/**
 * 
 * @param {string} flight_icao 
 * @param {string} flight_iata 
 */
async function open(flight) {
  isOpen.value = true;
  await getDetails(flight.flight_icao, flight.flight_iata)
}

function close() {
  details.value = null;
  isOpen.value = false;
}

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
@import "@/styles/_mixins";

.flight-details-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  display: flex;

  >.modal-content {
    margin: auto;
    padding: 2em;
    width: 40em;
    background-color: white;
    border-radius: 5px;
    position: relative;
    overflow-y: auto;
    height: fit-content;
    max-height: calc(100% - 12em); // 10em margin + 2em padding

    @include breakpoint-tablet {
      width: 80%;
    }

    >.button-close-container {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      >img {
        width: 2.5em;
        cursor: pointer;
      }
    }
  }
}

.close-button {
  width: 2em;
  position: absolute;
  right: 1em;
  top: 1em;
  margin-top: 0;
  cursor: pointer;
}

.flight-information-text {
  margin-top: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.other-information-container {
  border-collapse: collapse;
  width: 100%;

  td {
    padding: 0.5em 1em;
    text-align: left;
  }

  tr:hover {
    background-color: $color-light;
  }
}

.detail-item {
  display: flex;
  gap: 1em;

  >p {
    margin: 0;
  }
}

.flight-information-container {
  td {
    text-align: center;
  }
}

.flight-status-container {
  margin: 1em 0;
}

.is-empty {
  font-style: italic;
  font-size: 0.9em;
}
</style>