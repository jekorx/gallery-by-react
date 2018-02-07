// react 依赖
import React from 'react';
import { render } from 'react-dom';
import GalleryByReact from './components/GalleryByReact.jsx';
// 样式 scss
require('./style/index.scss');
// 
class App extends React.Component {
	render() {
		return <GalleryByReact />;
	}
}
render(<App />, document.getElementById('app'));