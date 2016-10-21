import React from 'react';
import ReactDOM from 'react-dom';
import CommonChart from './CommonChart';
import {Card} from 'antd';

export default class CommonGraphes extends React.Component {

	padding = {paddingTop: '15', paddingLeft: '15', paddingRight: '15'};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div style={this.padding}>
					<Card>
						<CommonChart name="BOLL超过中轴百分比" startDate="2016/06/01" queryStartDate="2014/02/07"/>
					</Card>
				</div>
				<div style={this.padding}>
					<Card>
						<CommonChart name="BOLL距上下轴3%股票数量差值百分比" startDate="2016/01/04" queryStartDate="2015/02/07"/>
					</Card>
				</div>
				<div style={this.padding}>
					<Card>
						<CommonChart name="MACD中轴上方百分比" startDate="2016/06/01" queryStartDate="2015/06/01"/>
					</Card>
				</div>
				<div style={this.padding}>
					<Card>
						<CommonChart name="DMA向上百分比" startDate="2016/06/01" queryStartDate="2015/07/09"/>
					</Card>
				</div>
			</div>
		);
	}
}
