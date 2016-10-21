import React from 'react';
import ReactDOM from 'react-dom';
import ReactEcharts from 'echarts-for-react';
import {HOSTNAME} from './Constants';

var Refetch = require('refetch');

export default class CommonChart extends React.Component {
	options = {
		title: {
			text: '',
			textAlign: 'left',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['上证指数','深圳综指','百分比'],
			align:'left',
			left: '7%',
		},
		toolbox: {
			show: true,
			align: 'right',
			right: '7%',
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {},
				saveAsImage: {show: true}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: [{
			type: 'value',
			name: '上证指数',
			scale: true,
			splitLine: {show: false}
		}, {
			type: 'value',
			name: '百分比',
			position: 'right',
			offset: 1000
		}, {
			type: 'value',
			name: '深圳综指',
			scale: true,
			splitLine: {show: false}
		}],
		dataZoom: [{
			startValue: '2016/06/01'
		}, {
			type: 'inside'
		}],
		series: [{
			name: '上证指数',
			type: 'line',
			smooth: true,
			data: [],
		}, {
			name: '深圳综指',
			type: 'line',
			smooth: true,
			data: []
		}, {
			name: '百分比',
			type: 'line',
			smooth: true,
			data: []
		}]
	};

	shExp = {
		name: '上证指数',
		smooth: true,
		type: 'line',
	};

	szExp = {
		name: '深证综指',
		smooth: true,
		type: 'line',
		yAxisIndex: 2
	};

	value = {
		smooth: true,
		type: 'line',
		yAxisIndex: 1
	};

	constructor(props) {
		super(props);
		this.options['title']['text'] = props.name;
		this.options['dataZoom'][0]['startValue'] = props.startDate;
		this.state = {
			options: this.options
		};
		Refetch.jsonp(HOSTNAME + "getAlgorithmResult.json?algorithm="
			+ unescape(props.name) + "&startDate=" + props.queryStartDate + "&endDate=2016/09/01")
			.then(function (result) {
				this.options['xAxis']['data'] = result.map((data) => data.date);
				var series = [];
				this.shExp['data'] = result.map((data) => data.shExp);
				this.szExp['data'] = result.map((data) => data.szExp);
				this.value['name'] = 'BOLL超过中轴百分比';
				this.value['data'] = result.map((data) => data.value);
				series.push(this.shExp);
				series.push(this.szExp);
				series.push(this.value);
				this.options['series'] = series;
				this.setState({options: this.options});
			}.bind(this)
		);
	}

	render() {
		return <div>
			<ReactEcharts option={this.state.options}/>
		</div>;
	}
}