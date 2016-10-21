import React from 'react';
import ReactDOM from 'react-dom';
import 'react-components-markdown/lib/markdown.css';
import {Button} from 'antd';
import {MarkdownEditorPreview} from 'react-markdown-editor';
import {HOSTNAME} from './Constants';
var Refetch = require('refetch');

export default class ReportViewer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			content: ""
		};
		Refetch.jsonp(HOSTNAME + "getReport.html", {username: encodeURIComponent(props.username), date: encodeURIComponent(props.date)})
			.then(function(result) {
				this.setState({content: decodeURIComponent(result)});
			}.bind(this));
	}

	render() {
		return <div>
			<MarkdownEditorPreview content={this.state.content}/>
			<div style={{padding: '20px 2%'}}>
				<Button type="primary" style={{float: 'left', width: '100px', height: '30px'}} onClick={this.props.backoff}>返回</Button>
			</div>
		</div>;
	}
}
