<template>
  <div class="arrival-container">
    <h2>
      <img class="icon-header" src="@assets/arrival.svg" />
      Arrivals
    </h2>

    <div class="flights-list-container">
      <table class="flights-list">
        <thead>
          <th>Flight</th>

          <th v-for="header of headers.arrival" :key="header.title" @click="sort(header)">
            {{ header.title }}
            <img class="icon-sort" src="@assets/cheveron_down.svg" :class="{ isReversed: header.sortOrder }" />
          </th>
        </thead>

        <tr v-if="!Array.isArray(flights.departure) || flights.departure.length === 0">
          <td colspan="5">No data.</td>
        </tr>

        <tbody v-if="flights.arrival">
          <tr v-for="arrival of flights.arrival" @click="$refs.flightDetailsModal.open(arrival)">
            <td>{{ arrival.airline_iata ?? arrival.airline_icao }} {{ arrival.flight_number }}</td>
            <td>{{ convertDate(arrival.dep_time) }}</td>
            <td>{{ convertDate(arrival.arr_time) }}</td>
            <td>{{ arrival.dep_iata }}</td>
            <td class="col-status" :class="'status-' + arrival.status">
              <div>{{ arrival.status }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flights-pagination">
      <Pagination :lastPage="lastPage.arrival" :page="page.arrival" @update:page="(p) => getByPage('arrival', p)" />
    </div>
  </div>

  <FlightDetailsModalVue ref="flightDetailsModal"/>
</template>

<script setup>
import Pagination from '@/components/Pagination';
import FlightDetailsModalVue from '@/modals/FlightDetailsModal.vue';
import {
  convertDate,
  flights,
  page,
  lastPage,
  headers,
  currentSort,
  sortBy,
  getByPage,
} from '@stores/Flight';

function sort(header) {
  // revert the order
  header.sortOrder = !header.sortOrder;
  // set the current sort
  currentSort.value.arrival = header;
  // sort the flights
  sortBy('arrival', header.sortBy, header.sortOrder);
}
</script>

<style lang="scss" scoped>
@import "@/styles/_mixins";

.arrival-container {
  margin-top: 5em;

  >.flights-list-container {
    overflow: auto;
    @include flights-table;
  }

  @include flights-pagination;
}
</style>