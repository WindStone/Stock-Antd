import React from 'react';
import {Row, Col, Select, InputNumber, Icon} from 'antd';

const symbolOps = [
	<Option key="gt">{">"}</Option>,
	<Option key="ge">{">="}</Option>,
	<Option key="lt">{"<"}</Option>,
	<Option key="le">{"<="}</Option>
];

const props = ['volumeSymbol_', 'volumeWindow_', 'volumePercent_'];
const defaultProps = ['gt', 10, 100];

export default class VolumeCondition extends React.Component {
	static propTypes = {
		form: React.PropTypes.any.isRequired,
		lineStyle: React.PropTypes.object.isRequired,
		iconStyle: React.PropTypes.object.isRequired,
		index: React.PropTypes.number.isRequired,
		deleteFunc: React.PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			deleteConfirm: false
		}
	}

	render() {
		const {getFieldProps} = this.props.form;
		return (
			<Row type="flex" justify="start" align="middle" style={this.props.lineStyle}>
				<Col span={2}>
					<span style={{float: 'right', marginRight: '10%'}}>成交量条件：</span>
				</Col>
				<Col span={18}>
					<span>成交量</span>
					<Select name="volumeSymbol"
					        style={{width: 54, marginLeft: 5, marginRight: 5}}
					        {...getFieldProps(props[0] + this.props.index, {initialValue: defaultProps[0]})}>
						{symbolOps}
					</Select>
					<span>前</span>
					<InputNumber name="volumeWindow" style={{width: 54, marginLeft: 5, marginRight: 5}}
					             min={1} step={1}
					             {...getFieldProps(props[1] + this.props.index, {initialValue: defaultProps[1]})}/>
					<span>日平均成交量</span>
					<InputNumber name="volumePercent" style={{width: 54, marginLeft: 5, marginRight: 0}}
					             min={0} step={5}
					             {...getFieldProps(props[2] + this.props.index, {initialValue: defaultProps[2]})}/>
					<span>%</span>
				</Col>
				<Col span={2}>
					{
						this.state.deleteConfirm ?
							<Button className="ant-btn-delete" style={{width: '67.5%', float: 'right'}}
							        onClick={this.deleteCondition.bind(this)}>删除</Button>
							: <Icon type="delete" style={{float: 'right'}}
							        onClick={() => {
								        this.setState({deleteConfirm: true})
							        }}/>
					}
				</Col>
				<Col span={1}>
					<Icon type="question-circle-o" style={this.props.iconStyle}/>
				</Col>
			</Row>
		);
	}

	deleteCondition() {
		var i = this.props.index, newProps = {};
		while (this.props.form.getFieldValue('volumePercent_' + (i + 1)) !== undefined) {
			for (var j in props) {
				newProps[props[j] + i] = this.props.form.getFieldValue(props[j] + (i + 1));
			}
			i = i + 1;
		}
		for (var j in props) {
			newProps[props[j] + i] = defaultProps[j];
		}
		this.props.form.setFieldsValue(newProps);
		this.setState({deleteConfirm: false});
		this.props.deleteFunc('volumeCondition');
	}
}