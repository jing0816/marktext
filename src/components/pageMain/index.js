import React from 'react';
import styles from './index.css';
import Range from './Range';

/**
 * 首页
 */
var arr = [];
class PageMain extends React.Component {
  indexOfArr(num, arr) {
    let include, index;

    arr.sort((a,b) => a.start - b.start).some((v,i) => {
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
    
    // console.log(num, include, index);
    return {include, index};
  }

  addArr(data, isAdd) {
    if(!arr.length) {
      arr.push(data);
    } else {
      const {include:startInclude, index:startIndex} = this.indexOfArr(data.start, arr);
      const {include:endInclude, index:endIndex} = this.indexOfArr(data.end, arr);

      console.log(startInclude, startIndex, data.start, endInclude, endIndex, data.end)
      if(!startInclude && !endInclude && startIndex === 0 && endIndex === 0) { //可在队列头部添加
        isAdd && arr.unshift(data);
      } else if(!startInclude && startIndex === arr.length) { //可在队列尾部添加
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
              content: document.getElementById('wrap').textContent.substring(start, end),
            });
          } else if(data.end === arr[endIndex].end){ //选中了队列中某个数组的结束部分
            const start = arr[endIndex].start;
            const end = data.start;
            arr.splice(startIndex, 1, {
              start,
              end,
              content: document.getElementById('wrap').textContent.substring(start, end),
            });
          } else { //选中了队列中某个数组的中间部分
            arr.splice(startIndex, 1, {
              start: arr[startIndex].start,
              end: data.start,
              content: document.getElementById('wrap').textContent.substring(arr[startIndex].start, data.start),
            }, {
              start: data.end,
              end: arr[endIndex].end,
              content: document.getElementById('wrap').textContent.substring(data.end, arr[endIndex].end),
            });
          }
        }
      } else if(!startInclude && !endInclude && startIndex === endIndex) { //可在队列中间插入，无需修改数组
        isAdd && arr.splice(startIndex, 0, data);
      } else { // 选中的范围在队列的数组内最少包含了1个数组
        if(isAdd) {
          const start = startInclude ? arr[startIndex].start : data.start;
          const end = endInclude ? arr[endIndex].end : data.end;
          arr.splice(startIndex, endInclude ? endIndex-startIndex+1 : endIndex-startIndex, {
            start,
            end,
            content: document.getElementById('wrap').textContent.substring(start, end),
          });
        } else {
          if(arr[startIndex].end === data.start && arr[startIndex+1].start === data.end) { //正好选中队列两个相邻数组中间的部分
            //
          } else {
            let start1, end1, start2, end2;

            if(startInclude && endInclude) { //选中的开始和结束至少在两个队列的数组内
              start1 = arr[startIndex].start;
              end1 = data.start;
              start2 = data.end;
              end2 = arr[endIndex].end;
              arr.splice(startIndex, endIndex-startIndex+1, {
                start: start1,
                end: end1,
                content: document.getElementById('wrap').textContent.substring(start1, end1),
              },{
                start: start2,
                end: end2,
                content: document.getElementById('wrap').textContent.substring(start2, end2),
              });
            } else if(endInclude) { //选中的结束在队列的数组内，开始不在
              start1 = data.end;
              end1 = arr[endIndex].end;
              arr.splice(startIndex, endIndex-startIndex+1, {
                start: start1,
                end: end1,
                content: document.getElementById('wrap').textContent.substring(start1, end1),
              });
            } else if(startInclude) { //选中的开始在队列的数组内，结束不在
              start1 = arr[startIndex].start;
              end1 = data.start;
              arr.splice(startIndex, endIndex-startIndex, {
                start: start1,
                end: end1,
                content: document.getElementById('wrap').textContent.substring(start1, end1),
              });
            }
          }
        }
      }
    }

    console.log(arr);
  }
  /**
   * 用元素替换被选中的文本
   */
  replaceSelectedStrByEle = (e) => {
    var me = window;
    const range = new Range(document.getElementById('wrap'));

    var sel = window.getSelection();
    if (sel && sel.rangeCount) {
      var firstRange = sel.getRangeAt(0);
      var lastRange = sel.getRangeAt(sel.rangeCount - 1);
      range.setStart(firstRange.startContainer, firstRange.startOffset)
        .setEnd(lastRange.endContainer, lastRange.endOffset);
      range.applyInlineStyle('i', {
        class: styles['custom-underline']
      }, '', (data) => {
        this.addArr(data, true);
      });
      range.select();
    } else {
      alert('请选择标记文字！')
    }
  }

  cancel = (e) => {
    var me = window;
    const range = new Range(document.getElementById('wrap'));

    var sel = window.getSelection();
    if (sel && sel.rangeCount) {
      var firstRange = sel.getRangeAt(0);
      var lastRange = sel.getRangeAt(sel.rangeCount - 1);
      range.setStart(firstRange.startContainer, firstRange.startOffset)
        .setEnd(lastRange.endContainer, lastRange.endOffset);
      range.removeInlineStyle('i', styles['custom-underline'], (data) => {
        this.addArr(data, false);
      });
      range.select();
    } else {
      alert('请选择标记文字！')
    }
  }

  render() {
    return (
      <div>
        笔记功能预研
        <div>
          <button onClick={this.replaceSelectedStrByEle}>标记</button>
          <button onClick={this.cancel}>取消</button>
        </div>
        <p id="wrap" className={styles['content']}>
          <h3>《道德经》全文</h3>
          <p>

            01.道可道，非常道。<i style={{background: '#f00'}}>哈哈哈哈哈</i>名可名，非常名。无名天地之始。有名万物之母。故常无欲以观其妙。常有欲以观

          其徼。此两者同出而异名，同谓之玄。玄之又玄，众妙之门。
            </p>

          <p>
            02.天下皆知美之为美，斯恶矣；皆知善之为善，斯不善已。故有无相生，难易相成，长短相形，高下相

            倾，音声相和，前後相随。是以圣人处无为之事，行不言之教。万物作焉而不辞。生而不有，为而不恃，

            功成而弗居。夫唯弗居，是以不去。
          </p>

          <p>
            03.不尚贤， 使民不争。不贵难得之货，使民不为盗。不见可欲，使民心不乱。是以圣人之治，虚其心，

            实其腹，弱其志，强其骨；常使民无知、无欲，使夫智者不敢为也。为无为，则无不治。
          </p>

          <p>
            04.道冲而用之，或不盈。渊兮似万物之宗。解其纷，和其光，同其尘，湛兮似或存。吾不知谁之子，象

            帝之先。
          </p>
          <p>
            05.天地不仁，以万物为刍狗。圣人不仁，以百姓为刍狗。天地之间，其犹橐迭乎？虚而不屈，动而愈出

            。多言数穷，不如守中。
          </p>
          <p>
            06.谷神不死是谓玄牝。玄牝之门是谓天地根。绵绵若存，用之不勤。
          </p>

          <p>
            07.天长地久。天地所以能长且久者，以其不自生，故能长生。是以圣人後其身而身先，外其身而身存。

            非以其无私邪！故能成其私。
          </p>
          <p>
            08.上善若水。水善利万物而不争，处众人之所恶，故几於道。居善地，心善渊，与善仁，言善信，正善

            治，事善能，动善时。夫唯不争，故无尤。
          </p>
        </p>
      </div>
    );
  }
}

export default PageMain
