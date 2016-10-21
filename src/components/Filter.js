import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import {
	Select,
	DatePicker,
	Checkbox,
	Radio,
	Input,
	InputNumber,
	Form,
	Button,
	Icon,
	Table,
	Card,
	Switch,
	Pagination,
	message
} from 'antd';
import VolumeCondition from '../entries/conditions/VolumeCondition';
import PriceCondition from '../entries/conditions/PriceCondition';
import {HOSTNAME} from './Constants';
var Refetch = require('refetch');
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const filterCheckBoxKeys = [
	{value: "shShare", label: "上证A股", reg: /^SH60/},
	{value: "szShare", label: "深圳A股", reg: /^SZ00/},
	{value: "szGem", label: "深圳创业板", reg: /^SZ300/}
];

const debugResultKeys = [
	{dataIndex: "date", key: "date", title: "日期"},
	{dataIndex: "stockName", key: "stockName", title: "股票名称"},
	{dataIndex: "stockCode", key: "stockCode", title: "股票代码"},
	{dataIndex: "type", key: "type", title: "涨幅类型"},
	{dataIndex: "raisingRate", key: "raisingRate", title: "涨幅"},
	{dataIndex: "shRaisingRate", key: "shRaisingRate", title: "上证指数涨幅"},
	{dataIndex: "szRaisingRate", key: "szRaisingRate", title: "深圳综指涨幅"}
];

const filterCondOps = [
	<Option key="priceCondition">价格条件</Option>,
	<Option key="volumeCondition">成交量条件</Option>
];

const questionStyle = {
	marginLeft: '30%'
};

const resultTableTitles = [{dataIndex: "title", key: "title", title: "比较项"},
	{dataIndex: "oneDayInc", key: "oneDayInc", title: "一日收益率"},
	{dataIndex: "fiveDayInc", key: "fiveDayInc", title: "五日收益率"},
	{dataIndex: "tenDayInc", key: "tenDayInc", title: "十日收益率"}];

const initResultTable = [{key: 1, title: "收益率", oneDayInc: "---", fiveDayInc: "---", tenDayInc: "---"},
	{key: 2, title: "相对沪指收益率", oneDayInc: "---", fiveDayInc: "---", tenDayInc: "---"},
	{key: 3, title: "相对深综收益率", oneDayInc: "---", fiveDayInc: "---", tenDayInc: "---"}];

const lineMarginStyle = {marginTop: 12, marginBottom: 12};

let Filter = React.createClass({

	getDateBefore(date, span) {
		var month = date.getMonth() - span;
		if (month < 0) {
			month += 12;
			date.setYear((date.getYear() - 1) + 1900);
		}
		date.setMonth(month);
		return date;
	},

	getInitialState() {
		var conditionStat = {
			priceCondition: {
				num: 0,
				clazz: PriceCondition
			},
			volumeCondition: {
				num: 0,
				clazz: VolumeCondition
			},
		};
		var state = {
			originalData: {},
			optionData: [],
			filterValue: [],
			dateSpan: [this.getDateBefore(new Date(), 3), new Date()],
			dateSpanValue: 3,
			resultData: initResultTable,
			debugResultData: [],
			filteredDebugResultData: [],
			filteredDebugValue: 'all',
			isDebugOn: false,
			conditions: conditionStat,
			filterCodes: [],
			loading: false
		};

		var newOptionData = [];
		for (var o in state.originalData) {
			newOptionData.push(<Option key={o}>{state.originalData[o]}</Option>);
		}
		state.optionData = newOptionData;
		return state;
	},

	componentDidMount: function () {
		Refetch.jsonp(HOSTNAME + 'stockcode.html').then(function (result) {
			this.setState({originalData: result});
			this.filterChanged(this.state.filterValue);
		}.bind(this));
	},

	handleSubmit(e) {
		e.preventDefault();
		var request = {... this.props.form.getFieldsValue()};
		request['startDate'] = request['dateSpan'][0];
		request['endDate'] = request['dateSpan'][1];
		var conditionNum = [];
		for (var key in this.state.conditions) {
			conditionNum.push(this.state.conditions[key].num);
		}
		request['conditionNum'] = conditionNum;
		this.setState({loading: true});
		Refetch.jsonp(HOSTNAME + 'statistics/statistics.html?request=' + JSON.stringify(request))
			.then(function (res) {
				this.setState({resultData: res.result, debugResultData: res.debug, loading: false});
				this.filterDebugResult(this.state.filteredDebugValue);
			}.bind(this));
	},

	debugFilterChanged(e) {
		var value = e.target.value;
		this.setState({filteredDebugValue: value});
		this.filterDebugResult(value);
	},

	filterDebugResult(value) {
		var filteredDebugResultData = [];
		if (value === 'all') {
			for (var i in this.state.debugResultData) {
				filteredDebugResultData.push(this.state.debugResultData[i]);
			}
		} else {
			var typeValue = value === 'oneDay' ? '1日涨幅' : undefined;
			typeValue = value === 'fiveDay' ? '5日涨幅' : typeValue;
			typeValue = value === 'tenDay' ? '10日涨幅' : typeValue;
			for (var i in this.state.debugResultData) {
				if (this.state.debugResultData[i].type === typeValue) {
					filteredDebugResultData.push(this.state.debugResultData[i]);
				}
			}
		}
		this.setState({filteredDebugResultData: filteredDebugResultData});
	},

	render() {
		const {getFieldProps} = this.props.form;

		const props = {
			iconStyle: questionStyle,
			lineStyle: lineMarginStyle,
			form: this.props.form,
			deleteFunc: this.deleteFunc
		};
		var conditions = [];
		for (var stat in this.state.conditions) {
			for (var i = 0; i < this.state.conditions[stat].num; ++i) {
				props['key'] = stat + i;
				props['index'] = i;
				var condition = React.createElement(this.state.conditions[stat].clazz, props);
				conditions.push(condition);
			}
		}

		return (
			<div style={{margin: 30}}>
				<Card title="过滤条件" bordered={true}>
					<Form onSubmit={this.handleSubmit}>
						<Row type="flex" justify="start" align="middle" style={lineMarginStyle}>
							<Col span={2}>
                            <span style={{float: 'right', marginRight: '10%'}}>
                                股票过滤：
                            </span>
							</Col>
							<Col span={15}>
								<Select multiple value={this.state.filterCodes}
								        style={{width: '100%'}}
								        onChange={this.changeFilterCodes}>
									{this.state.optionData}
								</Select>
								<hidden {...getFieldProps('specificFilterCode')}/>
							</Col>
							<Col span={5}>
                            <span style={{float: 'right'}}>
                            <CheckboxGroup options={filterCheckBoxKeys}
                                           value={this.state.filterValue}
                                           {...getFieldProps('filterGroup', {onChange: this.filterChanged})}/>
                            </span>
							</Col>
							<Col span={1}>
								<Icon type="question-circle-o" style={questionStyle}/>
							</Col>
						</Row>
						<Row type="flex" justify="start" align="middle" style={lineMarginStyle}>
							<Col span={2}>
                            <span style={{float: 'right', marginRight: '10%'}}>
                                时间过滤：
                            </span>
							</Col>
							<Col span={15}>
								<RangePicker value={this.state.dateSpan} style={{width: '100%'}}
								             onChange={this.dataSpanChanged}
								             {...getFieldProps('dateSpan', {initialValue: this.state.dateSpan})}/>
							</Col>
							<Col span={5}>
								<RadioGroup value={this.state.dateSpanValue} onChange={(e) => {
									this.setState({
										dateSpanValue: e.target.value,
										dateSpan: [this.getDateBefore(new Date(), e.target.value), new Date()]
									});
								}} style={{float: 'right'}}>
									<RadioButton value={1}>1个月</RadioButton>
									<RadioButton value={3}>3个月</RadioButton>
									<RadioButton value={6}>6个月</RadioButton>
									<RadioButton value={12}>12个月</RadioButton>
								</RadioGroup>
							</Col>
							<Col span={1}>
								<Icon type="question-circle-o" style={questionStyle}/>
							</Col>
						</Row>

						{conditions}

						<Row style={{marginTop: 20, marginBottom: 0}}>
							<Col span={3} offset={2}>
								<Button type="primary" style={{width: '45%', marginRight: '10%'}}
								        loading={this.state.loading} htmlType="submit">处理</Button>
								<Button style={{width: '45%'}}>重置</Button>
							</Col>
							<Col span={16} offset={1}>
								<Select style={{width: '89.69%'}} value={this.state.condType} onChange={(value) => {
									this.setState({condType: value})
								}}>
									{filterCondOps}
								</Select>
								<Button style={{width: '8.44%', marginLeft: '1.87%'}}
								        onClick={this.addCondition}>增加</Button>
							</Col>
						</Row>
					</Form>
				</Card>
				<Card title="处理结果" style={{marginTop: 15, marginBottom: 15}}>
					<Row>
						<Col span={20} offset={2}>
							<Table columns={resultTableTitles} dataSource={this.state.resultData}
							       pagination={false} bordered/>
						</Col>
					</Row>
				</Card>
				<Card title="详细结果" style={{marginTop: 15, marginBottom: 15}}
				      extra={<div>
					      <RadioGroup size="small" value={this.state.filteredDebugValue}
					                  style={this.state.isDebugOn ? {display: 'inline'} : {display: 'none'}}
					                  onChange={this.debugFilterChanged}>
						      <RadioButton value="all">全部</RadioButton>
						      <RadioButton value="oneDay">1日</RadioButton>
						      <RadioButton value="fiveDay">5日</RadioButton>
						      <RadioButton value="tenDay">10日</RadioButton>
					      </RadioGroup>
					      <Switch value={this.state.isDebugOn} onChange={(isOn) => {
						      this.setState({isDebugOn: isOn})
					      }} style={{marginLeft: 15}}/></div>}>
					<div style={this.state.isDebugOn ? {display: 'inline'} : {display: 'none'}}>
						<Row>
							<Col span={20} offset={2}>
								<Table columns={debugResultKeys} dataSource={this.state.filteredDebugResultData}
								       bordered/>
							</Col>
						</Row>
					</div>
				</Card>
			</div>
		);
	},

	filterChanged(value) {
		var newOptionData = [];
		var arrReg = [];
		filterCheckBoxKeys.map(function (data) {
			if (value.indexOf(data.value) != -1) {
				arrReg.push(data.reg);
			}
		});
		for (var o in this.state.originalData) {
			var match = false;
			arrReg.map(function (reg) {
				if (o.match(reg))   match = true;
			});
			if (!match) newOptionData.push(<Option key={o}>{this.state.originalData[o]}</Option>);
		}
		var filterCodes = [];
		for (var i in this.state.filterCodes) {
			var match = false;

			arrReg.map(function (reg) {
				if (this.state.filterCodes[i].match(reg))   match = true;
			}.bind(this));
			if (!match) filterCodes.push(this.state.filterCodes[i]);
		}
		this.setState({optionData: newOptionData, filterValue: value, filterCodes: filterCodes});
		this.props.form.setFieldsValue({specificFilterCode: filterCodes});
	},

	changeFilterCodes(value) {
		this.setState({filterCodes: value});
		this.props.form.setFieldsValue({specificFilterCode: value});
	},

	dataSpanChanged(value, dateString) {
		var date = new Date();
		if (value[1].getDate() == date.getDate() && value[0].getDate() == date.getDate()) {
			var month = value[1].getYear() * 12 + value[1].getMonth() - value[0].getYear() * 12 - value[0].getMonth();
			this.setState({dateSpan: value, dateSpanValue: month});
		} else {
			this.setState({dateSpan: value, dateSpanValue: 0});
		}
	},

	addCondition() {
		var conditions = {...this.state.conditions};
		conditions[this.state.condType].num++;
		this.setState({conditions: conditions});
	},

	deleteFunc(key) {
		var conditions = {...this.state.conditions};
		conditions[this.state.condType].num--;
		this.setState({conditions: conditions});
	}
});

Filter = Form.create()(Filter);

export default Filter;