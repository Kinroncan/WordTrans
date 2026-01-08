
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

/**
 * 【第二步：AI 逻辑层】
 * 这里负责和 Google Gemini 沟通。
 * 核心点在于如何告诉 AI 返回我们需要的“结构化数据”。
 */

// 初始化 AI 引擎。process.env.API_KEY 是系统自动注入的钥匙
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * getWordDetails 是一个“异步函数”（async）。
 * 因为网络请求需要时间，它不会立刻返回结果，而是返回一个 Promise（承诺）。
 * Promise<AIResponse> 意思就是：我承诺最后会给你一个符合 AIResponse 格式的结果。
 */
export const getWordDetails = async (word: string): Promise<AIResponse> => {
  // 调用 AI 模型生成内容
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // 使用速度最快的 Flash 模型
    contents: `请详细解释单词或词组: "${word}"。请提供其音标、中文释义、三个实用的英文例句以及一个有趣的记忆窍门(助记词)。`,
    config: {
      // 关键：强制 AI 返回 JSON 格式
      responseMimeType: "application/json",
      // responseSchema（响应模式）就像是一个模具，AI 必须按照这个模具吐出数据
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          phonetic: { type: Type.STRING, description: "单词的国际音标" },
          definition: { type: Type.STRING, description: "单词的中文意思" },
          examples: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "三个包含该单词的例句" 
          },
          mnemonic: { type: Type.STRING, description: "一个有趣的记忆技巧" }
        },
        required: ["phonetic", "definition", "examples", "mnemonic"] // 这些字段必不可少
      }
    }
  });

  // response.text 是 AI 返回的字符串（JSON 格式的字符串）
  const text = response.text;
  if (!text) throw new Error("AI 没能返回有效内容");
  
  // JSON.parse 将字符串转换成 JavaScript 对象
  // 'as AIResponse' 告诉 TypeScript：请放心，这个对象的形状肯定符合 AIResponse 接口
  return JSON.parse(text) as AIResponse;
};
