<template>
  <div class="flight-container">
    <div class="flight-content">
      <div class="input-airport">
        <h2>
          <img class="icon-header" src="@assets/airport.svg" />
          Search for flights
        </h2>

        <p class="bold">
          Please select an Australian major airport first to continue
          <span class="red">*</span>
        </p>

        <select v-model="selected">
          <option disabled value="null">Please select one</option>
          <option v-for="airport of airports" :key="airport.name" :value="airport.iata_code">{{ airport.name }}</option>
        </select>

        <p class="show-filter-text" @click="showFilter = !showFilter" v-if="selected">
          {{ showFilter ? 'Hide' : 'Show' }} Filters
          <img class="icon-sort" src="@assets/cheveron_down.svg" :class="{ isReversed: showFilter }" />
        </p>

        <transition name="slide-fade">
          <div class="departure-search-container" v-show="showFilter">
            <Input v-for="filter in filters"
                   :key="filter.label"
                   :label="filter.label"
                   :placeholder="filter.placeholder"
                   :query="filter.query"
                   :type="filter.type"
                   :options="filter.options"
                   @update:query="(value) => applyFilter(filter, value)" />
          </div>
        </transition>
      </div>

      <Flights header="Departures" type="departure" icon="departure.svg"/>
      <Flights header="Arrivals" type="arrival" icon="arrival.svg"/>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { onBeforeMount, ref } from 'vue';
import Input from '@/components/Input';
import Flights from '@/components/Flights';
import { airports, selected, filters, getAirports, filterFlights } from '@stores/Flight';

const showFilter = ref(false);

onBeforeMount(async () => {
  if (!airports.value) {
    await getAirports();
  }
});

/**
 * 
 * @param {Object} filter 
 * @param {any} value 
 */
function applyFilter(filter, value) {
  if (!selected.value) {
    Swal.fire('Airport missing!', 'Please select an airport first', 'error');
    return;
  }

  filter.query = value;
  filterFlights('departure');
  filterFlights('arrival');
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixins';

.flight-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 2em;

  @include breakpoint-tablet {
    padding: 0 1em 2em 1em;
    width: unset;
  }
}

.flight-content {
  width: 60em;
  margin: auto;

  @include breakpoint-laptop {
    width: 90%;
  }

  @include breakpoint-tablet {
    width: unset;
  }
}

.show-filter-text {
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.red {
  color: red;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  max-height: 35em;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>