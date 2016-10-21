import './index.html';
import './index.less';
import {Menu, Icon} from 'antd';
import {Row, Col} from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import Filter from '../components/Filter';
import CommonTables from '../components/CommonTables';
import CommonGraphes from '../components/CommonGraphes';
import Reports from '../components/Reports';
import Unsupport from '../components/Unsupport';
import {HOSTNAME} from '../components/Constants';

const components = {
	commonTables: <CommonTables/>,
	commonGraphs: <CommonGraphes/>,
	experimentTools: <Filter/>,
	customTables: <Unsupport/>,
	reports: <Reports/>
};

const initialKey = 'commonTables';

class Index extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			current: initialKey,
			component: components[initialKey]
		};
	}

	handleClick(e) {
		this.setState({
			current: e.key,
			component: components[e.key]
		});
	}

	render() {
		return (
			<Col>
				<Row>
					<Col span={24}>
						<img src={HOSTNAME + "image/banner.jpg"} height="300" width="100%"></img>
					</Col>
				</Row>
				<Row type="flex">
					<Col span={3}>
						<Menu onClick={this.handleClick.bind(this)}
						      style={{width: '100%', height: '100%'}}
						      selectedKeys={[this.state.current]}
						      mode="inline">
							<Menu.Item key="commonTables"><Icon type="appstore-o"/>公共表格</Menu.Item>
							<Menu.Item key="commonGraphs"><Icon type="line-chart"/>公共图表</Menu.Item>
							<Menu.Item key="experimentTools"><Icon type="share-alt"/>试验工具</Menu.Item>
							<Menu.Item key="customTables"><Icon type="appstore"/>个性化表格</Menu.Item>
							<Menu.Item key="reports"><Icon type="credit-card"/>总结提高</Menu.Item>
						</Menu>
					</Col>
					<Col span={21} width="100%">
						{this.state.component}
					</Col>
				</Row>
			</Col>
		);
	}
}

ReactDOM.render(
	<Index />
	, document.getElementById('root'));