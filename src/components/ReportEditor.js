import React from 'react';
import ReactDOM from 'react-dom';
import 'react-components-markdown/lib/markdown.css';
import {MarkdownEditor} from 'react-markdown-editor';
import {Button, Modal} from 'antd';
import {HOSTNAME} from './Constants';
var Refetch = require('refetch');
const confirm = Modal.confirm;

export default class ReportEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state={
		    content: "",
		    hasChange: false,
		    date: props.date,
		    visible: false
		};

		Refetch.jsonp(HOSTNAME + "getReport.html", {username: encodeURIComponent(props.username), date: encodeURIComponent(props.date)})
		    .then(function(result) {
		        this.setState({content: decodeURIComponent(result)});
		    }.bind(this));
	}

	render() {
	    var funcBar=<div style={{padding: '10px 2%'}}>
	        {
	        this.state.hasChange ?
	            <Button className="ant-btn-delete" style={{float: 'left', width: '100px', height: '30px'}} onClick={this.backoff.bind(this)}>返回</Button>
	          : <Button type="primary" style={{float: 'left', width: '100px', height: '30px'}} onClick={this.backoff.bind(this)}>返回</Button>
	        }
	        <Button style={{float: 'right', width: '100px', height: '30px', margin: '10px, 0'}} type='primary'
	            onClick={this.save.bind(this)}>保存</Button>
	        <Button style={{float: 'right', width: '100px', height: '30px', margin: '10px, 0', marginRight: '10px'}}
	            onClick={() => {this.setState({content: "", hasChange: true})}}>清空</Button>
	    </div>;
		return <div>
		    <div style={{height:500}}>
			    <MarkdownEditor initialContent={this.state.content} content={this.state.content}
			        iconsSet='font-awesome' funcBar={funcBar} onContentChange={this.onContentChange.bind(this)} />
		    </div>
		    <Modal visible={this.state.visible} title="是否保存" footer={[
		        <Button onClick={() => {this.setState({visible: false, hasChange: false}); this.props.backoff()}} >不保存返回</Button>,
		        <Button onClick={() => {this.setState({visible: false})}}>取    消</Button>,
		        <Button onClick={() => {this.save(); this.props.backoff()}}>保存返回</Button>,
		    ]}>
		        当前内容尚未保存，是否要进行保存并返回？
		    </Modal>
		</div>;
	}

	save() {
        Refetch.post(HOSTNAME + "saveReport.html", {'username': this.props.username, 'date': this.props.date, 'content': this.state.content});
        this.setState({hasChange: false});
	}

	backoff() {
	    if (this.state.hasChange) {
	        this.setState({visible: true});
	    } else {
	        this.props.backoff();
	    }
	}

	onContentChange(content) {
	    if (! this.state.hasChange) {
	        this.setState({hasChange: true, content: content});
	    }
	    this.setState({content: content});
	}
}
