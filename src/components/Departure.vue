<template>
  <div class="departure-container">
    <h2>
      <img class="icon-header" src="@assets/departure.svg" />
      Departures
    </h2>
 
    <div class="flights-list-container">
      <table class="flights-list">
        <thead>
          <th>Flight</th>

          <th v-for="header of headers.departure" :key="header.title" @click="sort(header)">
            {{ header.title }}
            <img class="icon-sort" src="@assets/cheveron_down.svg" :class="{ isReversed: header.sortOrder }" />
          </th>
        </thead>

        <tr v-if="!flights.departure || flights.departure.length === 0">
          <td colspan="5">No data.</td>
        </tr>

        <tbody v-if="flights.departure">
          <tr v-for="departure of flights.departure" @click="$refs.flightDetailsModal.open(departure)">
            <td>{{ departure.airline_iata ?? departure.airline_icao }} {{ departure.flight_number }}</td>
            <td>{{ convertTime(departure.dep_time) }}</td>
            <td>{{ convertTime(departure.arr_time) }}</td>
            <td>{{ departure.arr_iata }}</td>
            <td class="col-status" :class="'status-' + departure.status"><div>{{ departure.status }}</div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flights-pagination">
      <Pagination :lastPage="lastPage.departure" :page="page.departure" @update:page="(p) => getByPage('departure', p)" />
    </div>
  </div>

  <FlightDetailsModal ref="flightDetailsModal" />
</template>

<script setup>
import FlightDetailsModal from '@/modals/FlightDetailsModal';
import Pagination from '@/components/Pagination';
import {
  convertTime, 
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
  currentSort.value.departure = header;
  // sort the flights
  sortBy('departure', header.sortBy, header.sortOrder);
}
</script>

<style lang="scss" scoped>
@import "@/styles/_mixins";

.departure-container {
  margin-top: 5em;

  > .flights-list-container {
    overflow: auto;
    @include flights-table;
  }

  @include flights-pagination;
}
</style>