import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Table, Button, Progress} from 'antd';
import ReactTimeout from 'react-timeout';
import {HOSTNAME} from './Constants';

var Refetch = require('refetch');
const titles = ['最高点峰值10%内涨停排序预测', '距2.18最高点跌幅超过25%按跌幅排序预测',
	'最近两个月超跌25%预测', '最近两个月超涨33%预测'];
const dataIndexes = ['nearestPeak', 'febOverRally', 'overRally', 'overRaise'];

const alignCenter = (text) => <div style={{width: "100%", textAlign: "center"}}>{text}</div>;
const columns = [{
	title: alignCenter('日期'),
	dataIndex: 'date',
	width: '10%',
	render: alignCenter
}, {
	title: alignCenter(titles[0]),
	dataIndex: dataIndexes[0],
	render: alignCenter,
	width: '22.5%',
}, {
	title: alignCenter(titles[1]),
	dataIndex: dataIndexes[1],
	render: alignCenter,
	width: '22.5%',
}, {
	title: alignCenter(titles[2]),
	dataIndex: dataIndexes[2],
	render: alignCenter,
	width: '22.5%',
}, {
	title: alignCenter(titles[3]),
	dataIndex: dataIndexes[3],
	render: alignCenter,
	width: '22.5%'
}];

class CommonTables extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			deleteConfirm: false,
			data: [],
			percent: 100
		}
		this.props.setInterval(this.queryState.bind(this), 1000);
	}

	queryState() {
		Refetch.jsonp(HOSTNAME + "process.json").then(function (result) {
			this.setState({percent: result.value});
		}.bind(this));
	}

	componentDidMount() {
		Refetch.jsonp(HOSTNAME + "results.json").then(function (result) {

			var data = result.map(function (data) {
				var row = {};
				row['date'] = data.date;

				var buildTableName = function (title, date) {
					return encodeURIComponent(title) + "_" + date + ".xls";
				}
				for (var i in data.fileList) {
					if (data.fileList[i]) {
						row[dataIndexes[i]] = <div style={{width: '100%'}}>
							<div style={{width: '50%', float: 'left', paddingLeft: '10%'}}>
								<Button style={{width: '80%'}} onClick={() => {
									Refetch.get(HOSTNAME + "file.html?filename=" + buildTableName(titles[i], data.date));
								}}>Download</Button>
							</div>
							<div style={{width: '50%', float: 'right', paddingRight: '10%'}}>
								<Button style={{width: '80%'}} onClick={() => {
									Refetch.get(HOSTNAME + "trigger.json?fileName=" + buildTableName(titles[i], data.date));
								}}>Trigger</Button>
							</div>
						</div>;
					} else {
						row[dataIndexes[i]] = <div style={{width: '100%'}}>
							<div style={{width: '50%', float: 'left', paddingLeft: '10%'}}>
								<Button style={{width: '80%'}} disabled>Download</Button>
							</div>
							<div style={{width: '50%', float: 'right', paddingRight: '10%'}}>
								<Button style={{width: '80%'}} onClick={() => {
									Refetch.get(HOSTNAME + "trigger.json?fileName=" + buildTableName(titles[i], data.date));
								}}>Trigger</Button>
							</div>
						</div>
					}
				}
				return row;
			});

			this.setState({data: data});
		}.bind(this));
	}

	render() {
		return (
			<Card>
				<Table columns={columns} dataSource={this.state.data} bordered={true} useFixedHeader={true}/>
				<div><Progress percent={this.state.percent}/></div>
			</Card>
		);
	}

}

export default ReactTimeout(CommonTables);