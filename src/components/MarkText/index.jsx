import React from 'react';
import Mark from './mark';
import './index.css';

/**
 * 首页
 */
class MarkText extends React.Component {  
  constructor(props) {
    super(props);
    this.markData = {};
    this.markRef = React.createRef();
    this.menuRef = React.createRef();
    this.mark = null;
    this.state = {
      style: {
        display: 'none',
      },
    };
  }

  componentDidMount() {
    this.markRef.current.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      this.setState({
        style: {
          display: 'block',
          left: e.clientX+'px',
          top: e.clientY+'px',
        }
      });
    });
    document.addEventListener('click', e => {
      if(!(this.menuRef.current && this.menuRef.current.contains(e.target))) {
        this.setState({
          style: {
            display: 'none',
          }
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.clear !== this.props.clear && this.props.clear) {
      this.markData = {};
      this.mark.clear();
      this.props.onChange && this.props.onChange([]);
    }
  }

  handleMark = () => {
    if(!this.mark) {
      this.mark = new Mark(this.markRef.current, this.props.markClassName || 'custom-underline');
    }
    this.mark && this.mark.select(data => {
      
    });
    this.setState({
      style: {
        display: 'none',
      }
    });
    this.props.onChange && this.props.onChange(this.mark.data);
  }

  handleCancel = () => {
    if(this.mark) {
      this.mark.cancel();
      this.props.onChange && this.props.onChange(this.mark.data);
    }
    this.setState({
      style: {
        display: 'none',
      }
    });
    
  }

  // 按钮必须是button，不能是a
  render() {
    const {style} = this.state;

    return (
      <div className="MarkText-mark-content" ref={this.markRef}>
        {this.props.children}
        <div className="mark-right-menu" style={style} ref={this.menuRef}>
          <ul>
            <li><button onClick={this.handleMark}>标记</button></li>
            <li><button onClick={this.handleCancel}>取消标记</button></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default MarkText
