import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';

export default class ReportButtons extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.hasReport) {
			return <div style={{width: "100%", textAlign: "center"}}>
				<div style={{width: '50%', float: 'left', paddingLeft: '10%'}}>
					<Button style={{width: '80%'}}
					        onClick={() => {this.props.setViewState('Edit', this.props.date, this.props.username, true)}}>
						修  改
					</Button>
				</div>
				<div style={{width: '50%', float: 'right', paddingRight: '10%'}}>
					<Button style={{width: '80%'}}
					        onClick={() => {this.props.setViewState('View', this.props.date, this.props.username, true)}}>
						查  看
					</Button>
				</div>
			</div>;
		} else {
			return <div style={{width: "100%", textAlign: "center"}}>
				<div style={{width: '50%', float: 'left', paddingLeft: '10%'}}>
					<Button style={{width: '80%'}}
					        onClick={() => {this.props.setViewState('Edit', this.props.date, this.props.username, false)}}>
						撰  写
					</Button>
				</div>
				<div style={{width: '50%', float: 'right', paddingRight: '10%'}}>
					<Button style={{width: '80%'}} disabled>查  看</Button>
				</div>
			</div>;
		}
	}
}