import React from 'react';
import ReactDOM from 'react-dom';
import {Card, Table, Button} from 'antd';
import ReportEditor from './ReportEditor';
import ReportViewer from './ReportViewer';
import ReportButtons from './ReportButtons';
import {HOSTNAME} from './Constants';
var Refetch = require('refetch');

const alignCenter = (text) => <div style={{width: "100%", textAlign: "center"}}>{text}</div>;
const baseColumns = {
	title: alignCenter('日期'),
	dataIndex: 'date',
	width: 180,
	view: {
		viewOp: null,
		viewUser: null,
		viewDate: null,
		hasReport: null
	}
};

export default class Reports extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			columns : [baseColumns],
			datas : null,
			reports : null,
			users : null
		}

		this.fetchData();
	}

	fetchData() {
		Refetch.jsonp(HOSTNAME + "getAllReports.html").then(function(result) {
			this.setState({reports: result['reports'], users: result['users']});
		}.bind(this));
	}

	buildUsers(users) {
		var columns = [];
		columns.push(baseColumns);
		for (var i in users) {
			var column = [];
			column['dataIndex'] = users[i].username;
			column['title'] = alignCenter(decodeURIComponent(users[i].realname));
			columns.push(column);
		}

		return columns;
	}

	buildReports(reports) {
		var datas = [];
		for (var i in reports) {
			var data = {};
			data['date'] = alignCenter(reports[i]['date']);
			for (var j in reports[i]) {
				if (j != 'date') {
					data[j] = <ReportButtons hasReport={reports[i][j]} username={j} date={reports[i]['date']}
					                         setViewState={this.setViewState.bind(this)} />;
				}
			}
			datas.push(data);
		}
		return datas;
	}

	setViewState(operation, date, user, hasReport) {
		this.setState({view: {viewOp: operation, viewDate: date, viewUser: user, hasReport: hasReport}});
	}

	backoff() {
		this.setState({view: {viewOp: null, viewDate: null, viewUser: null}});
		this.fetchData();
	}

	render() {
		var content = '';
		var reports = this.buildReports(this.state.reports);
		var columns = this.buildUsers(this.state.users);
		if (this.state.view == null || this.state.view.viewOp == null) {
			content = <Table columns={columns} dataSource={reports} bordered={true} />
		} else if (this.state.view.viewOp == 'Edit') {
			content = <ReportEditor hasReport={this.state.view.hasReport} username={this.state.view.viewUser}
			                        date={this.state.view.viewDate} backoff={this.backoff.bind(this)}/>
		} else if (this.state.view.viewOp == 'View') {
			content = <ReportViewer username={this.state.view.viewUser}
			                        date={this.state.view.viewDate} backoff={this.backoff.bind(this)} />
		}
		return <Card>
			{content}
		</Card>
	}
}
