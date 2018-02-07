// react 依赖
import React from 'react';
import ReactDOM from 'react-dom';
// 样式 scss
require('../style/gallery.scss');
// 获取文件相关的数据
var imageDatas = require('../data/imagesData.json');
// 自执行函数将图片信息转成图片URL路径信息
imageDatas = ((imageDatasArr) => {
	imageDatasArr.forEach((imgData, i) => {

		imgData.imageURL = require('../../assets/images/' + imgData.fileName);

		imageDatasArr[i] = imgData;
	});
	return imageDatasArr;
})(imageDatas);

// 图片模块组件
class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	// 点击处理
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		var styleObj = {};
		// 如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		// 如果图片的旋转角度有值且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			});
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					 alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.content}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

// 控制组件
class CtrlUnit extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		// 如果点击的是当前正在选中态的按钮，则翻转图片，否则置为居中态
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		var ctrlUnitClassName = 'ctrl-unit';

		// 如果图片居中，居中态按钮
		if (this.props.arrange.isCenter) {
			ctrlUnitClassName += ' is-center';
			// 如果同时是翻转图片，翻转态
			if (this.props.arrange.isInverse) {
				ctrlUnitClassName += ' is-inverse';
			}
		}
		return (
			<span
				className={ctrlUnitClassName}
				onClick={this.handleClick}	
			></span>
		);
	}
}

// 主组件
class GalleryByReact extends React.Component {
	constructor(props) {
		super(props);
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0 
			},
			// 水平方向取值范围
			hPosRange: {
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			// 垂直方向取值范围
			vPosRange: {
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
			imgsArrangeArr: [
				{
					/*
					// 定位
					pos: {
						left: '0',
						top: '0'
					},
					// 旋转角度
					rotate: 0,
					// 图片正反面
					isInverse: false,
					// 是否中心图片
					isCenter: false
					*/ 
				}
			]
		};
	}

	/* es6写法，初始化state 在构造函数中
	getInitialState() {
		return {
			imgsArrangeArr: [{}]
		};
	}*/

	/*
	 * 获取区间内的一个随机值
	 * @param low 
	 * @param high 
	 */
	getRangeRandom(low, high) {
		return Math.ceil(Math.random() * (high - low) + low);
	}

	/*
	 * 获取-30 ~ 30任意值
	 */
	get30Random() {
		return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
	}

	/*
	 * 反转图片
	 * @param index 输入执行inverse 操作图片的index值
	 * @return {Function} 闭包，返回真正待执行的函数
	 */
	inverse(index) {
		return () => {
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}
	}
	/*
	 * 反转图片
	 * @param index 输入执行inverse 操作图片的index值
	 * @return {Function} 闭包，返回真正待执行的函数
	 */
	center(index) {
		return () => {
			this.rearrange(index);
		}
	}

	/*
	 * 重新布局所有图片
	 * @param centerIndex 指定居中排布图片索引
	 */
	rearrange(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecx = hPosRange.leftSecX,
			hPosRangeRightSecx = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			// 取一个或者不取
			topImgNum = Math.floor(Math.random() * 2),
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		// 居中centerIndex的图片
		imgsArrangeCenterArr[0] = {
			// 位置
			pos: centerPos,
			// 居中图片不需要旋转
			rotate: 0,
			isCenter: true
		};

		// 取出要布局上册图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		
		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach((value, index) => {
			value = {
				pos: {
					top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: this.get30Random(),
				isInverse: false,
				isCenter: false
			};
		});

		// 布局左右两侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;

			// 前半部分布局左边，后半部分布局右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecx;
			} else {
				hPosRangeLORX = hPosRangeRightSecx;
			}
			imgsArrangeArr[i] = {
				pos: {
					top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: this.get30Random(),
				isInverse: false,
				isCenter: false
			};
		}

		// 将上侧图片信息放回数组
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeArr[0]);
		}

		// 将中心区域图片信息放回数组
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});

	}

	// 组件加载后，为每张图片计算其位置的范围
	componentDidMount() {
		// 拿到舞台大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到imageFigure大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		// 计算左侧右侧区域图片排布位置取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		
		// 计算上侧区域图片排布位置取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);

	}

	render() {
		var ctrlUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(value, index) {

			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isCenter: false
				}
			}

			imgFigures.push(
				<ImgFigure 
					key={value.id}
					data={value}
					ref={'imgFigure' + index}
					arrange={this.state.imgsArrangeArr[index]}
					inverse={this.inverse(index)}
					center={this.center(index)}
				/>
			);

			ctrlUnits.push(
				<CtrlUnit
					key={value.id}
					arrange={this.state.imgsArrangeArr[index]}
					inverse={this.inverse(index)}
					center={this.center(index)}
				/>
			);

		}.bind(this)); // es6箭头函数无需写bind(this)，箭头函数不改变作用域

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="ctrl-nav">
					{ctrlUnits}
				</nav>
			</section>
		);
	}
}
// 对外暴露主组件
module.exports = GalleryByReact;