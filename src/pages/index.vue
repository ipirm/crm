<template>
	<div class="index-page">
		<div class="index-page__container">
			<div class="tabs">
				<button class="tabs__item" :class="{active: i == visibleSystemIndex}" v-for="(system, i) in systems" :key="system" @click="visibleSystemIndex = i">{{ system }}</button>
			</div>
			<apexchart type="line" width="600" height="400" :options="chartData.options" :series="chartData.series"></apexchart>
			<div class="tabs">
				<button class="tabs__item" :class="{active: visibleSitesIndexes.find(v => v == i) != undefined ? true : false}" v-for="(website, i) in sites" :key="website" @click="setVisibleSites(i)">{{ website }}</button>
			</div>
		</div>
		<div class="index-page__container">
			<table class="table table-bordered table-centered table-responsive mb-0">
				<thead class="table-success">
					<tr>
						<th>Сайт</th>
						<th>Система</th>
						<th v-for="date in dates" :key="date">{{ date }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(pair, i) in systemSitePairs" :key="i">
						<td class="bg-warning">{{ pair[0] }}</td>
						<td class="bg-primary text-white">{{ pair[1] }}</td>
						<td v-for="(date, k) in dates" :key="k">
							<input class="text-center" type="number" v-model="chartTableData.find(v => v.data == date && v.system == pair[0] && v.site == pair[1]).value">
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'Index',

	async created() {
		this.chartTableData = await this.getChartTableData();
	},

	data() {
		return {
			chartTableData: [],
			visibleSystemIndex: 0,
			visibleSitesIndexes: [0]
		}
	},

	computed: {
		systems() {
			if (this.chartTableData)
				return [...new Set(this.chartTableData.map(v => v.system))]
			return []
		},

		sites() {
			if (this.chartTableData)
				return [...new Set(this.chartTableData.map(v => v.site))]
			return []
		},

		systemSitePairs() {
			if (this.chartTableData)
				return [this.systems, this.sites].reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []))
			return []
		},

		dates() {
			if (this.chartTableData)
				return [...new Set(this.chartTableData.map(v => v.data))].sort((a, b) => b - a)
			return []
		},

		chartData() {
			let chart = {
				series: [],
				options: {
					xaxis: {
						categories: []
					},
					stroke: {
						curve: 'smooth',
						width: 3
					}
				}
			};

			if (this.chartTableData) {
				chart.system = this.systems[this.visibleSystemIndex],

					// adding unique sites (only visible ones)
					this.sites.forEach((item, i) => {
						if (this.visibleSitesIndexes.find(v => v == i) != undefined) {
							chart.series.push({
								name: item,
								type: 'line',
								data: []
							});
						}
					});

				// setting the first website as area on the chart
				if (chart.series[0])
					chart.series[0].type = 'area';

				// adding data to the table
				let xaxis = [];
				this.chartTableData.forEach(item => {
					if (item.system == chart.system) {
						let website = chart.series.find(site => site.name == item.site);
						if (website) {
							if (xaxis.find(v => v != item.data))
								xaxis.push(item.data);
							website.data.push({
								x: item.data,
								y: item.value
							});
						}
					}
				});
				chart.options.xaxis.categories = xaxis;
			}

			return chart;
		}
	},

	methods: {
		...mapActions(['getChartTableData']),

		setVisibleSites(i) {
			const index = this.visibleSitesIndexes.findIndex(v => v == i);
			if (index != -1)
				this.visibleSitesIndexes.splice(index, 1);
			else
				this.visibleSitesIndexes.push(i);
		}
	}
}

</script>
<style lang="scss">
.tabs {
	display: flex;

	&__item {
		margin-right: 10px;
		border: 1px solid black;
		border-radius: 30px;
		padding: 5px 10px;
		background: white;
		transition: background .2s ease;

		&.active {
			background: rgba(0, 255, 0, .5);
		}

		&:focus {
			outline: none;
		}
	}
}

.index-page {
	display: flex;
	flex-direction: column;
	align-items: center;

	&__container {
		padding: 20px;
		margin-bottom: 10px;
		max-width: 100%;

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	.table {
		input {
			border: none;
			outline: none;
			width: unset;
			max-width: 60px;
		}
	}
}

</style>
