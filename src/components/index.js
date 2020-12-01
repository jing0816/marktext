import React from 'react';
import MarkText from './MarkText/index.jsx';
import './index.css';

const html = 'Baby Baby 对你的钟爱\n\n就要就要把你给宠坏'

/**
 * 首页
 */
class PageMain extends React.Component {
  constructor(props) {
    super(props);
    this.markData = {};
    this.state = {
      clear: false,
    }
  }

  handleChange(data, key) {
    this.markData[key] = data;
    this.setState({
      clear: false,
    });
  }

  saveMarkText = () => {
    const arr = [];
    Object.keys(this.markData).map(v => {
      this.markData[v].length && arr.push({
        key: v,
        markList: this.markData[v]
      });
    });

    if(arr.length) {
      console.log(arr);
    } else {
     alert('无标记内容！');
    }
  }

  clearMarkText = () => {
    this.markData = {};
    this.setState({
      clear: true,
    });
  }
  
  render() {
    const {clear} = this.state;
    return (
      <div className="wrap">
        <div>
          <span>nononono</span>
          <MarkText
            onChange={data => this.handleChange(data, 'shui')}
            markClassName="custom-underline"
            clear={clear}
          >
            <span data-mark>
              <span className="text-detail-gray">123456腾讯成立于1998年11月，是目前中国<span style={{background: '#f00'}}>最大</span>的互联网综合服务提供商之一，也是中国服务用户最多的互联网企业之一。成立10多年以来，腾讯一直秉承“一切以用户价值为依归”的经营理念，始终处于稳健发展的状态。2004年6月16日，腾讯控股有限公司在香港联交所主板公开上市（股票代号700）。
      通过互联网服务提升人类生活品质是腾讯的使命。目前，腾讯把为用户提供“一站式在线生活服务”作为战略目标，提供互联网增值服务、网络广告服务和电子商务服务。通过即时通信工具<span style={{background: '#f00'}}>QQ</span>、移动社交和通信<span style={{background: '#f00'}}>服务微信和WeChat</span>、门户网站腾讯网（<span style={{background: '#f00'}}>QQ.com</span></span>
            </span>
          </MarkText>
          
          <span>nononono</span>
          <p><span dangerouslySetInnerHTML={{ __html: html }}></span></p>
        </div>
        <div>
          <span>nononono</span>
          {/* <MarkText
            onChange={data => this.handleChange(data, 'nian')}
            markClassName="custom-underline"
          >
            <div data-mark>
              <h1>念奴娇·赤壁怀古</h1>
              <p>
              大江东去，浪淘尽，千古风流人物。
              </p>
              <p>
              故垒西边，人道是，三国周郎赤壁。
              </p>
              <p>
              乱石穿空，惊涛拍岸，卷起千堆雪。
              </p>
              <p>
              江山如画，一时多少豪杰。
              </p>
              <p>
              遥想公瑾当年，小乔初嫁了，雄姿英发。
              </p>
              <p>
              羽扇纶巾，谈笑间，樯橹灰飞烟灭。
              </p>
              <p>
              故国神游，多情应笑我，早生华发。
              </p>
              <p>
              人生如梦，一尊还酹江月。
              </p>
            </div>
          </MarkText> */}
          
        </div>
        <div className="btns"><a onClick={this.saveMarkText}>保存</a></div>
        <div className="btns"><a onClick={this.clearMarkText}>清除</a></div>
      </div>
    );
  }
}

export default PageMain
