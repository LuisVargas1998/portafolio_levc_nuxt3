<template>
  <v-container fluid class="text-center background pa-0">
    <div style="text-align: center">
      <v-card>
        <div class="pa-2 pa-md-2">
          <h1>Gráfico de Datos Cube</h1>
        </div>
      </v-card>
      <div style="height: 40px"></div>
    </div>
    <query-builder
      :cubejs-api="cubejsApi"
      :query="query"
      :disableHeuristics="true"
      css="width: 100%"
    >
      <template
        v-slot:builder="{
          measures,
          setMeasures,
          availableMeasures,
          dimensions,
          setDimensions,
          availableDimensions,
          timeDimensions,
          setTimeDimensions,
          availableTimeDimensions,
        }"
      >
        <v-card>
          <div class="pa-md-6">
            <v-row>
              <v-col md="3" sm="6" cols="12">
                <v-select
                  label="Measures"
                  outlined
                  hide-details
                  v-model="measure"
                  :value="measures.map((i) => i.name)"
                  @change="setMeasures"
                  :items="availableMeasures.map((i) => i.name)"
                  density="compact"
                />
              </v-col>
              <v-col md="2" sm="6" cols="12">
                <v-select
                  label="Dimensions"
                  outlined
                  hide-details
                  :value="dimensions.map((i) => i.name)"
                  @change="setDimensions"
                  :items="availableDimensions.map((i) => i.name)"
                  density="compact"
                />
              </v-col>
              <v-col md="3" sm="6" cols="12">
                <v-select
                  label="Time Dimensions"
                  outlined
                  hide-details
                  :value="timeDimensions.map((i) => i.name)"
                  @change="setTimeDimensions"
                  :items="availableTimeDimensions.map((i) => i.name)"
                  density="compact"
                />
              </v-col>
              <v-col md="2" sm="6" cols="12">
                <v-select
                  label="Granularity"
                  v-model="by"
                  @change="setBy($event)"
                  outlined
                  hide-details
                  density="compact"
                  :items="[
                    'All time',
                    'Today',
                    'Yesterdar',
                    'This week',
                    'This month',
                    'This quarter',
                    'This Year',
                    'Last 7 days',
                  ]"
                />
              </v-col>
              <v-col md="2" sm="6" cols="12">
                <v-select
                  label="by"
                  v-model="granulari"
                  @change="setGranulari($event)"
                  outlined
                  hide-details
                  density="compact"
                  :items="[
                    'second',
                    'minute',
                    'hour',
                    'day',
                    'week',
                    'month',
                    'quarter',
                    'year',
                  ]"
                />
              </v-col>
            </v-row>
          </div>
        </v-card>
        <div style="height: 20px"></div>
      </template>
      <template v-slot="{ resultSet }">
        <div v-if="resultSet"></div>
        <div>
          <v-card>
            <div class="pa-md-10">
              <canvas id="myChart" height="100" width="300"></canvas>
            </div>
          </v-card>
        </div>
      </template>
    </query-builder>
  </v-container>
</template>
<script>
import Chart from "chart.js";
import cubejs from "@cubejs-client/core";
import { QueryBuilder } from "@cubejs-client/vue3";

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzc3ODMxNTN9.B69XhPZkgAns1IS6OQemGKxUiMj0aZ8KOic0CeJJLfs",
  {
    apiUrl: `https://olive-dolphin.aws-us-east-2.cubecloudapp.dev/cubejs-api/v1`,
  }
);

const measure = "Orders.count";
const dimensions = "";
const timeDi = "Orders.createdAt";
const by = "This month";
const granulari = "day";

definePageMeta({
  //middleware: ["auth"],
});

export default {
  name: "HelloWorld",

  components: {
    QueryBuilder,
  },
  data: () => {
    const query = {
      measures: [measure],
      timeDimensions: [
        {
          dimension: measure.split(".")[0] + ".createdAt",
          granularity: granulari,
          dateRange: by,
        },
      ],
      order: {
        [measure.split(".")[0] + ".createdAt"]: "asc",
      },
    };

    return {
      cubejsApi,
      query,
      measure,
      selectedMeasure: measure,
      chart: null,
      granulari,
      by,
      selectedGranulari: granulari,
      selectedBy: by,
    };
  },
  methods: {
    series(resultSet) {
      return resultSet.series().map((series) => ({
        name: series.key,
        data: series.series.map((row) => [row.x, row.value]),
      }));
    },
    setMeasures() {
      this.selectedMeasure = this.measure;
    },
    setGranulari(newVal) {
      this.granulari = newVal;
    },
    setBy(newVal) {
      this.by = newVal;
    },
    updateChart() {
      this.cubejsApi
        .load({
          measures: [this.measure],
          timeDimensions: [
            {
              dimension: `${this.measure.split(".")[0]}.createdAt`,
              granularity: `${this.granulari}`,
              dateRange: `${this.by}`,
            },
          ],
          order: {
            [`${this.measure.split(".")[0]}.createdAt`]: "asc",
          },
        })
        .then((resultSet) => {
          const chartData = {
            labels: resultSet.chartPivot().map((row) => {
              const date = new Date(row["x"]);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            }),
            datasets: [
              {
                label: this.measure,
                data: resultSet.chartPivot().map((row) => row[this.measure]),
                borderColor: "#3F51B580",
                fill: false,
              },
            ],
          };
          this.chart.data = chartData;
          this.chart.update();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    const ctx = document.getElementById("myChart");

    this.cubejsApi
      .load(this.query)
      .then((resultSet) => {
        this.chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: resultSet.chartPivot().map((row) => {
              const date = new Date(row["x"]);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            }),

            datasets: [
              {
                label: "Orders",
                data: resultSet.chartPivot().map((row) => row[this.measure]),
                borderColor: "#3F51B580",
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
        console.log(resultSet.chartPivot());
      })
      .catch((error) => {
        console.error(error);
      });
    this.$watch("measure", (newValue, oldValue) => {
      this.updateChart();
    });

    this.$watch("measure", (newValue, oldValue) => {
      this.selectedMeasure = newValue;
      this.query = {
        measures: [newValue],
        timeDimensions: [
          {
            dimension: newValue.split(".")[0] + ".createdAt",
            granularity: this.granulari,
            dateRange: this.by,
          },
        ],
        order: {
          [newValue.split(".")[0] + ".createdAt"]: "asc",
        },
      };
      this.updateChart();
    });

    this.$watch("granulari", (newValue, oldValue) => {
      this.selectedGranulari = newValue;
      this.query = {
        measures: [this.measure],
        timeDimensions: [
          {
            dimension: this.measure.split(".")[0] + ".createdAt",
            granularity: newValue,
            dateRange: this.by,
          },
        ],
        order: {
          [this.measure.split(".")[0] + ".createdAt"]: "asc",
        },
      };
      this.updateChart();
    });

    this.$watch("by", (newValue, oldValue) => {
      this.selectedBy = newValue;
      this.query = {
        measures: [this.measure],
        timeDimensions: [
          {
            dimension: this.measure.split(".")[0] + ".createdAt",
            granularity: this.granulari,
            dateRange: newValue,
          },
        ],
        order: {
          [this.measure.split(".")[0] + ".createdAt"]: "asc",
        },
      };
      this.updateChart();
    });
  },
};
</script>
<style scoped>
.chart-container {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .my-col {
    width: 100%;
  }
}
</style>
