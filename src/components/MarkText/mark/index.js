import Range from './Range';
import domUtils from './domUtils.js'

class MarkText {
  constructor(wrap, className) {
    this.wrap = wrap;
    this.data = [];
    this.className = className;

    // this.range = new Range(this.wrap);
    // this.sel = window.getSelection();
  }

  indexOfArr(num, arr) {
    let include, index;

    //arr.sort((a,b) => a.start - b.start) 本身就排序了
    arr.some((v,i) => {
      if(v.start <= num && num <= v.end) {
        include = true;
        index = i;
        return true;
      } else {
        include = false;
        if(num < v.start) {
          index = i;
          return true;
        } else {
          index = arr.length;
        }
      }
    })
    
    return {include, index};
  }

  addArr(data, isAdd) {
    const arr = this.data;

    if(!arr.length) {
      arr.push(data);
    } else {
      const {include:startInclude, index:startIndex} = this.indexOfArr(data.start, arr);
      const {include:endInclude, index:endIndex} = this.indexOfArr(data.end, arr);

      // console.log(startInclude, startIndex, data.start, endInclude, endIndex, data.end)

      if(!startInclude && !endInclude && startIndex === 0 && endIndex === 0) { //选中的头部空白部分
        isAdd && arr.unshift(data);
      } else if(!startInclude && startIndex === arr.length) { //选中尾部空白部分
        isAdd && arr.push(data);
      } else if(startInclude && endInclude && startIndex === endIndex) { //选中的范围包含在队列的某个数组内
        if(!isAdd) {
          if(data.start === arr[startIndex].start && data.end === arr[endIndex].end) { //选中的范围与队列的中的某个数组一样
            arr.splice(startIndex, 1);
          } else if(data.start === arr[startIndex].start) { //选中了队列中某个数组的开始部分
            const start = data.end;
            const end = arr[endIndex].end;
            arr.splice(startIndex, 1, {
              start,
              end,
              content: this.wrap.textContent.substring(start, end),
            });
          } else if(data.end === arr[endIndex].end){ //选中了队列中某个数组的结束部分
            const start = arr[endIndex].start;
            const end = data.start;
            arr.splice(startIndex, 1, {
              start,
              end,
              content: this.wrap.textContent.substring(start, end),
            });
          } else { //选中了队列中某个数组的中间部分
            arr.splice(startIndex, 1, {
              start: arr[startIndex].start,
              end: data.start,
              content: this.wrap.textContent.substring(arr[startIndex].start, data.start),
            }, {
              start: data.end,
              end: arr[endIndex].end,
              content: this.wrap.textContent.substring(data.end, arr[endIndex].end),
            });
          }
        }
      } else if(!startInclude && !endInclude && startIndex === endIndex) { //选中中间的空白部分
        isAdd && arr.splice(startIndex, 0, data);
      } else { // 选中的范围在队列的数组内最少包含了1个数组
        if(isAdd) {
          const start = startInclude ? arr[startIndex].start : data.start;
          const end = endInclude ? arr[endIndex].end : data.end;
          arr.splice(startIndex, endInclude ? endIndex-startIndex+1 : endIndex-startIndex, {
            start,
            end,
            content: this.wrap.textContent.substring(start, end),
          });
        } else {
          if(arr[startIndex].end === data.start && arr[startIndex+1].start === data.end) { //正好选中队列两个相邻数组中间的部分
          } else if(!startInclude && !endInclude) { //选中的部分完全包含了之前选中的
            arr.splice(startIndex, endIndex-startIndex+1);
          } else {
            let start1, end1, start2, end2;

            if(startInclude && endInclude) { //选中的部分都在目前被选的范围内
              start1 = arr[startIndex].start;
              end1 = data.start;
              start2 = data.end;
              end2 = arr[endIndex].end;
              arr.splice(startIndex, endIndex-startIndex+1, {
                start: start1,
                end: end1,
                content: this.wrap.textContent.substring(start1, end1),
              },{
                start: start2,
                end: end2,
                content: this.wrap.textContent.substring(start2, end2),
              });
            } else if(startInclude || endInclude) { //选中的开始在队列的数组内，结束不在;选中的结束在队列的数组内，开始不在
                start1 = startInclude ? arr[startIndex].start : data.end;
                end1 = startInclude? data.start : arr[endIndex].end;
                if(start1 === end1) {
                  arr.splice(startIndex, startInclude? endIndex-startIndex : endIndex-startIndex+1);
                } else {
                  arr.splice(startIndex, startInclude? endIndex-startIndex : endIndex-startIndex+1, {
                    start: start1,
                    end: end1,
                    content: this.wrap.textContent.substring(start1, end1),
                  });
                }
            }
          }
        }
      }
    }

    console.log(arr);
  }

  limitRange(firstRange, lastRange, callback) {
    const startPosition = domUtils.getPosition(firstRange.startContainer, this.wrap);
    const endPosition = domUtils.getPosition(lastRange.endContainer, this.wrap);

    if(startPosition === 2 || endPosition === 4) { // 未选中标记范围
      callback({
        flag: 0,
        code: 1,
        msg: '未选中标记范围',
      });
    } else if(startPosition === 10 && endPosition === 10) {
      callback({
        flag: 1,
      });
    } else if(startPosition === 4 && endPosition === 10) { // 开始不在标注范围内
      callback({
        flag: 0,
        code: 3,
        msg: '开始不在标注范围内',
      });
    } else if(startPosition === 10 && endPosition === 2) { // 结束不在标注范围内
      callback({
        flag: 0,
        code: 4,
        msg: '结束不在标注范围内',
      });
    } else if(startPosition === 4 && endPosition === 2) { // 开始结束范围超过了标注范围
      callback({
        flag: 0,
        code: 2,
        msg: '开始结束范围超过了标注范围',
      });
    }
  }

  select(callback) {
    const range = new Range(this.wrap);
    const sel = window.getSelection();
    
    if (sel && sel.rangeCount) {
      const firstRange = sel.getRangeAt(0);
      const lastRange = sel.getRangeAt(sel.rangeCount - 1);

      this.limitRange(firstRange, lastRange, data => {
        if(data.flag) {
          range.setStart(firstRange.startContainer, firstRange.startOffset).setEnd(lastRange.endContainer, lastRange.endOffset);
          range.applyInlineStyle('i', {
            class: this.className
          }, '', (data) => {
            this.addArr(data, true);
          });
          range.select();
        } else {
          callback && callback(data);
        }
      });
      
      // const startfilterNode = domUtils.findParent(firstRange.startContainer, node => {
      //   if(node === this.wrap) {
      //     return true;
      //   }
      // }, true );
      // const endfilterNode = domUtils.findParent(lastRange.endContainer, node => {
      //   if(node === this.wrap) {
      //     return true;
      //   }
      // }, true );
      // if(startfilterNode && endfilterNode) {
      //   //正常范围选择
      // } else if(!startfilterNode && !endfilterNode) {
      //   //开始结束都不在正常范围内
      //   // const startNextNode = domUtils.getNextDomNode(firstRange.startContainer, true, node => {
      //   //   if(node === this.wrap) {
      //   //     return true;
      //   //   }
      //   // });
      //   // console.log(startNextNode);


      //   // console.log(domUtils.getPosition(firstRange.startContainer, this.wrap))
      // } else if(startfilterNode) {
      //   //开始在正常范围内
      // } else if(endfilterNode) {
      //   //结束在正常范围内
      // }

      // if(!domUtils.inDoc(firstRange.startContainer, this.wrap) && !domUtils.inDoc(lastRange.endContainer, this.wrap)) { // 未选中规定区域内的文本
      //   console.log('未选中规定区域内的文本')
      //   //不进行任何处理
      // } else if(!domUtils.inDoc(firstRange.startContainer, this.wrap)) { //开始不在规定区域内
      //   console.log('开始不在规定区域内')
      // } else if(!domUtils.inDoc(lastRange.endContainer, this.wrap)) { //结束不在规定区域内
      //   console.log('结束不在规定区域内')
      // } else { //正常操作，开始结束都在规定区域内
      //   console.log('正常操作，开始结束都在规定区域内')
      // }
    }
  }

  cancel() {
    const range = new Range(this.wrap);
    const sel = window.getSelection();

    if (sel && sel.rangeCount) {
      var firstRange = sel.getRangeAt(0);
      var lastRange = sel.getRangeAt(sel.rangeCount - 1);

      this.limitRange(firstRange, lastRange, data => {
        if(data.flag) {
          range.setStart(firstRange.startContainer, firstRange.startOffset).setEnd(lastRange.endContainer, lastRange.endOffset);
          range.removeInlineStyle('i', this.className, (data) => {
            this.addArr(data, false);
          });
          range.select();
        }
      });
    } else {
      alert('请选择标记文字！')
    }
  }

  clear() {
    const range = new Range(this.wrap);
    range.clear(this.wrap.querySelectorAll(`.${this.className}`))
    this.data = [];
  }
}

export default MarkText