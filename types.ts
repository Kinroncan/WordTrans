
/**
 * 【第一步：蓝图定义】
 * 这个文件定义了应用中所有数据的“形状”。
 * 在 TypeScript 中，我们通过 Interface（接口）来规定对象必须包含哪些属性。
 */

// WordEntry 定义了每一个保存到词汇本里的“单词条目”长什么样
export interface WordEntry {
  id: string;        // 唯一的标识符，用于在列表渲染时区分不同的词
  word: string;      // 单词原文
  phonetic?: string; // 音标。注意：'?' 表示这个属性是可选的，即使没有也不会报错
  definition: string;// 中文释义
  examples: string[];// 例句。'string[]' 表示这是一个由字符串组成的数组
  mnemonic: string;  // 助记词（记忆窍门）
  timestamp: number; // 记录添加时间的时间戳
}

// AppStatus 使用了 Enum（枚举）来定义应用可能的几种状态
// 这样在代码里写 status === AppStatus.LOADING 比写 status === 'loading' 更安全
// 因为编译器会帮你检查有没有拼写错误
export enum AppStatus {
  IDLE = 'IDLE',       // 空闲状态（初始状态）
  LOADING = 'LOADING', // 正在请求 AI 处理中
  ERROR = 'ERROR',     // 发生错误时
  SUCCESS = 'SUCCESS'  // 处理成功时
}

// AIResponse 定义了 AI 返回的 JSON 数据格式
// 确保我们从 AI 获取的数据可以直接映射到我们的 UI 上
export interface AIResponse {
  phonetic: string;
  definition: string;
  examples: string[];
  mnemonic: string;
}
