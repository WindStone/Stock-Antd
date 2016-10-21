import React from 'react';
import {Row, Col, Switch, Pagination} from 'antd';
import '../entries/index.less';

const TogglePagination = React.createClass({
	render() {
		return (
			<Row>
				<Col span={10}>
					<Switch/>
				</Col>
				<Col span={10}>
					<Pagination total={20}/>
				</Col>
			</Row>
		);
	}
});

export default TogglePagination;
