import React from 'react';
import MarkText from './pageMain';
import './index.css';

/**
 * 首页
 */
class PageMain extends React.Component {
  constructor(props) {
    super(props);
    this.markData = {};
  }

  setMarkTextKey(e, key) {
    if(!this.markData[key]) {
      this.markData[key] = new MarkText(e.currentTarget, 'custom-underline');
    }
    this.key = key;
  }

  markText(key) {
    this.key === key && this.markData[key] && this.markData[key].select();
  }

  cancleMarkText(key) {
    this.key === key && this.markData[key] && this.markData[key].cancel();
  }

  saveMarkText = () => {
    const arr = [];
    Object.keys(this.markData).map(v => {
      this.markData[v].data.length && arr.push({
        key: v,
        markList: this.markData[v].data
      });
    });

    if(arr.length) {
      console.log(arr);
    } else {
     alert('无标记内容！');
    }
  }

  // 按钮必须是button，不能是a
  render() {
    return (
      <div className="wrap">
        <div className="btns"> 
          <button onClick={() => this.markText('shui')}>标注</button>
          <button onClick={() => this.cancleMarkText('shui')}>取消标注</button>
        </div>
        <div onClick={e => this.setMarkTextKey(e, 'shui')}>
          <h1>水调歌头</h1>
          <p>
          丙辰中秋，欢饮达旦，大醉，<i style={{background: '#f00'}}>作此篇</i>，兼怀子由。
          </p>
          <p>
          明月几时有，把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。
          </p>
          <p>
          转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。
          </p>
        </div>
        <div className="btns">
          <button onClick={() => this.markText('nian')}>标注</button>
          <button onClick={() => this.cancleMarkText('nian')}>取消标注</button>
        </div>
        <div onClick={e => this.setMarkTextKey(e, 'nian')}>
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
        <div className="btns"><a onClick={this.saveMarkText}>保存</a></div>
      </div>
    );
  }
}

export default PageMain
