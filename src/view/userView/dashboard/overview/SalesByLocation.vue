<template>
  <div class="full-width-table">
    <sdCards more>
      <template #title>
        <div class="ninjadash-card-title-wrap">
          <span class="ninjadash-card-title-text"> Sales By Region </span>
        </div>
      </template>
      <!-- <template #button>
        <div class="ninjadash-card-nav">
          <ul>
            <li
              :class="
                locations === 'today' ? 'ninjadash-active' : 'ninjadash-today'
              "
            >
              <router-link
                @click="(e) => handleActiveChangeLocation(e, 'today')"
                to="#"
              >
                Today
              </router-link>
            </li>
            <li
              :class="
                locations === 'week' ? 'ninjadash-active' : 'ninjadash-week'
              "
            >
              <router-link
                @click="(e) => handleActiveChangeLocation(e, 'week')"
                to="#"
              >
                Week
              </router-link>
            </li>
            <li
              :class="
                locations === 'month' ? 'ninjadash-active' : 'ninjadash-month'
              "
            >
              <router-link
                @click="(e) => handleActiveChangeLocation(e, 'month')"
                to="#"
              >
                Month
              </router-link>
            </li>
          </ul>
        </div>
      </template> -->
      <template #more>
        <router-link to="#">
          <unicon name="print" width="16"></unicon>
          <span>Printer</span>
        </router-link>
        <router-link to="#">
          <unicon name="book-open" width="16"></unicon>
          <span>PDF</span>
        </router-link>
        <router-link to="#">
          <unicon name="file-alt" width="16"></unicon>
          <span>Google Sheets</span>
        </router-link>
        <router-link to="#">
          <unicon name="x" width="16"></unicon>
          <span>Excel (XLSX)</span>
        </router-link>
        <router-link to="#">
          <unicon name="file" width="16"></unicon>
          <span>CSV</span>
        </router-link>
      </template>
      <a-row>
        <a-col :xxl="24" :lg="24" :xs="24">
          <LocationTableWrap>
            <div class="table-responsive">
              <a-table
                :columns="sellingColumns"
                :dataSource="sellingData"
                :pagination="false"
              >
              </a-table>
            </div>
          </LocationTableWrap>
        </a-col>
      </a-row>
    </sdCards>
  </div>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from "vue";
import { LocationTableWrap } from "../style";

import { useStore } from "vuex";

const sellingColumns = [
  {
    title: "Top Region",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Order",
    dataIndex: "order",
    key: "order",
  },
  {
    title: "Revenue",
    dataIndex: "revenue",
    key: "revenue",
  },
];

const SalesByLocation = defineComponent({
  name: "SalesByLocation",
  components: {
    LocationTableWrap,
  },
  setup() {
    const { state, dispatch } = useStore();
    const topLocationState = computed(() => state.chartContent.locationData);
    const locations = ref("today");

    const handleActiveChangeLocation = (event, value) => {
      event.preventDefault();
      locations.value = value;
      dispatch("topLocationFilterData", value);
    };

    const sellingData = computed(() =>
      topLocationState.value
        ? topLocationState.value.map((value) => {
            const { key, location, order, revenue } = value;
            return {
              key,
              location,
              order,
              revenue,
            };
          })
        : []
    );

    onMounted(() => dispatch("topLocationGetData"));

    return {
      topLocationState,
      handleActiveChangeLocation,
      sellingColumns,
      sellingData,
      locations,

      options: {
        width: 492,
        height: 180,
        zoom: true,
        hideAntarctic: true,
        landsColor: "#E3E6EF",
        landsBorder: "#E3E6EF",
      },
    };
  },
});

export default SalesByLocation;
</script>
