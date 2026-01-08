
import React, { useState, useEffect, useCallback } from 'react';
import { WordEntry, AppStatus } from './types';
import { getWordDetails } from './services/geminiService';
import WordCard from './components/WordCard';

/**
 * 【第四步：应用大脑】
 * 这是整个应用的主入口。它负责管理所有的状态和逻辑。
 */
const App: React.FC = () => {
  // --- 状态定义 (State) ---
  // useState 是 React 的“记忆”。当这些值改变时，网页会自动更新。
  
  // input: 当前搜索框里输入的文字
  const [input, setInput] = useState('');
  
  // words: 已经收藏的单词列表。注意 <WordEntry[]> 规定了数组里只能装这种类型的对象
  const [words, setWords] = useState<WordEntry[]>([]);
  
  // status: 应用当前的运行状态（空闲、加载中、错误等）
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  
  // errorMsg: 报错时显示的文字
  const [errorMsg, setErrorMsg] = useState('');

  // --- 副作用处理 (Effects) ---
  
  // 第一个 useEffect：应用启动时运行一次（[] 依赖项为空）
  // 作用：从浏览器的本地存储 (localStorage) 读取之前保存的单词
  useEffect(() => {
    const saved = localStorage.getItem('my-words');
    if (saved) {
      try {
        setWords(JSON.parse(saved));
      } catch (e) {
        console.error("加载本地存储失败", e);
      }
    }
  }, []);

  // 第二个 useEffect：每当 words 列表发生变化时运行
  // 作用：把最新的单词列表存进本地存储，这样刷新页面数据也不会丢
  useEffect(() => {
    localStorage.setItem('my-words', JSON.stringify(words));
  }, [words]);

  // --- 逻辑处理 (Functions) ---

  // 处理提交单词的函数
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表单默认的刷新行为
    
    // 如果输入为空或者正在加载中，则直接返回，不执行后续代码
    if (!input.trim() || status === AppStatus.LOADING) return;

    setStatus(AppStatus.LOADING); // 更新状态为加载中（按钮会变颜色，显示加载动画）
    setErrorMsg('');             // 清空之前的报错

    try {
      // 1. 调用 AI 服务获取详细信息
      const details = await getWordDetails(input.trim());
      
      // 2. 根据 AI 返回的结果，构造一个完整的 WordEntry 对象
      const newEntry: WordEntry = {
        id: crypto.randomUUID(), // 使用浏览器内置 API 生成唯一 ID
        word: input.trim(),
        phonetic: details.phonetic,
        definition: details.definition,
        examples: details.examples,
        mnemonic: details.mnemonic,
        timestamp: Date.now()   // 记录当前时间
      };

      // 3. 将新单词插入到列表的最前面
      setWords(prev => [newEntry, ...prev]);
      
      // 4. 清空输入框并重置状态
      setInput('');
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg('抱歉，AI 此时无法解析该单词，请稍后再试。');
      setStatus(AppStatus.ERROR);
    }
  };

  /**
   * 删除单词的函数
   * useCallback 用于缓存这个函数，避免不必要的重新渲染
   */
  const deleteWord = useCallback((id: string) => {
    // 过滤掉那个 ID 匹配的单词，剩下的保留
    setWords(prev => prev.filter(w => w.id !== id));
  }, []);

  // --- 界面渲染 (JSX) ---
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 头部标题区 */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          AI <span className="text-indigo-600">智能词汇本</span>
        </h1>
        <p className="text-slate-500">
          只需输入单词，剩下的交给 AI。通过助记词和例句高效记忆。
        </p>
      </header>

      {/* 输入表单区 */}
      <section className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 mb-10 border border-slate-100">
        <form onSubmit={handleAddWord} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入一个你想学习的单词或短语..."
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-lg font-medium"
              disabled={status === AppStatus.LOADING}
            />
            {/* 如果正在加载，在输入框右侧显示转圈动画 */}
            {status === AppStatus.LOADING && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <i className="fa-solid fa-circle-notch fa-spin text-indigo-500"></i>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={status === AppStatus.LOADING || !input.trim()}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-200"
          >
            {status === AppStatus.LOADING ? 'AI 分析中...' : '学习此词'}
          </button>
        </form>

        {/* 错误提示信息 */}
        {errorMsg && (
          <p className="mt-4 text-red-500 text-sm font-medium flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}
          </p>
        )}
      </section>

      {/* 列表展示区 */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            已收藏词汇 <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-sm font-mono">{words.length}</span>
          </h2>
          {/* 只有在有单词时才显示清空按钮 */}
          {words.length > 0 && (
            <button 
              onClick={() => { if(confirm('确定清空全部吗？')) setWords([]); }}
              className="text-sm text-slate-400 hover:text-red-500 transition-colors"
            >
              清空全部
            </button>
          )}
        </div>

        {/* 条件渲染：如果没有单词，显示空状态提示 */}
        {words.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl">
            <i className="fa-solid fa-book-open text-slate-200 text-6xl mb-4"></i>
            <p className="text-slate-400 font-medium italic">目前还没有词汇，快去输入一个吧！</p>
          </div>
        ) : (
          // 否则，渲染网格布局的单词卡片
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {words.map(entry => (
              <WordCard key={entry.id} entry={entry} onDelete={deleteWord} />
            ))}
          </div>
        )}
      </div>

      {/* 页脚说明 */}
      <footer className="mt-20 text-center text-slate-400 text-sm border-t border-slate-100 pt-8">
        <p>Built with React + TypeScript + Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
