
import React from 'react';
import { WordEntry } from '../types';

/**
 * 【第三步：UI 零件】
 * 这个组件只负责一件事情：把一个单词的信息漂亮地展示出来。
 */

// 定义组件接收的“参数”类型。在 React 中叫 Props
interface WordCardProps {
  entry: WordEntry;              // 传入一个单词条目对象
  onDelete: (id: string) => void; // 传入一个删除函数。'(id: string) => void' 表示它接收一个 ID，不返回任何值
}

/**
 * React.FC 是 Functional Component（函数式组件）的缩写
 * <WordCardProps> 是泛型，告诉 React：这个组件的 Props 必须符合 WordCardProps 定义
 */
const WordCard: React.FC<WordCardProps> = ({ entry, onDelete }) => {
  return (
    // 使用 Tailwind CSS 类名进行修饰：白色背景、圆角、阴影、边框、悬停变影
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            {/* 展示单词标题 */}
            <h3 className="text-2xl font-bold text-slate-800">{entry.word}</h3>
            {/* 展示音标 */}
            <span className="text-sm text-indigo-500 font-mono">{entry.phonetic}</span>
          </div>
          {/* 删除按钮 */}
          <button 
            onClick={() => onDelete(entry.id)} // 点击时调用父组件传进来的删除逻辑
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
        
        {/* 展示释义 */}
        <p className="text-slate-700 font-medium mb-4">
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-sm mr-2">释义</span>
          {entry.definition}
        </p>

        {/* 循环渲染例句数组 */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">实用例句</p>
          {entry.examples.map((example, index) => (
            // 在 React 中循环生成的元素必须带上 'key'，以便 React 追踪变化
            <p key={index} className="text-sm text-slate-600 italic border-l-2 border-slate-100 pl-3">
              "{example}"
            </p>
          ))}
        </div>

        {/* 展示助记词区域 */}
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
          <p className="text-xs font-bold text-amber-700 mb-1">💡 助记窍门</p>
          <p className="text-sm text-amber-800 leading-relaxed">{entry.mnemonic}</p>
        </div>
      </div>
      
      {/* 底部显示添加时间 */}
      <div className="bg-slate-50 px-5 py-2 text-[10px] text-slate-400 text-right">
        添加于 {new Date(entry.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default WordCard;
