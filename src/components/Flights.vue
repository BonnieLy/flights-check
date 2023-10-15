<template>
  <div class="flight-container">
    <h2>
      <img class="icon-header" :src="'/' + icon" />
      {{ header }}
    </h2>
 
    <div class="flights-list-container">
      <table class="flights-list">
        <thead>
          <th>Flight</th>

          <th v-for="header of headers[type]" :key="header.title" @click="sort(header)">
            {{ header.title }}
            <img class="icon-sort" src="@assets/cheveron_down.svg" :class="{ isReversed: header.sortOrder }" />
          </th>
        </thead>

        <tbody v-if="!Array.isArray(flights[type]) || flights[type].length === 0">
          <tr><td colspan="5">No data.</td></tr>
        </tbody>

        <tbody v-else>
          <tr v-for="flight of flights[type]" @click="$refs.flightDetailsModal.open(flight)">
            <td>{{ flight.airline_iata ?? flight.airline_icao }} {{ flight.flight_number }}</td>
            <td>{{ convertDate(flight.dep_time) }}</td>
            <td>{{ convertDate(flight.arr_time) }}</td>
            <td>{{ type === 'departure' ? flight.arr_iata : flight.dep_iata }}</td>
            <td class="col-status" :class="'status-' + flight.status"><div>{{ flight.status }}</div></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flights-pagination">
      <Pagination :lastPage="lastPage[type]" :page="page[type]" @update:page="(p) => getByPage(type, p)" />
    </div>
  </div>

  <FlightDetailsModal ref="flightDetailsModal" />
</template>

<script setup>
import FlightDetailsModal from '@/modals/FlightDetailsModal';
import Pagination from '@/components/Pagination';
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

const props = defineProps({
  'header': {
    type: String,
    required: true,
  },
  'type': {
    type: String,
    required: true,
  },
  'icon': {
    type: String,
    required: true,
  },
});

function sort(header) {
  // revert the order
  header.sortOrder = !header.sortOrder;
  // set the current sort
  currentSort.value[props.type] = header;
  // sort the flights
  sortBy(props.type, header.sortBy, header.sortOrder);
}
</script>

<style lang="scss" scoped>
@import "@/styles/_mixins";

.flight-container {
  margin-top: 5em;

  > .flights-list-container {
    overflow: auto;
    @include flights-table;
  }

  @include flights-pagination;
}
</style>