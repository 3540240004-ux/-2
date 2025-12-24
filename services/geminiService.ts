
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI client following guidelines using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinalImpactReport = async (stats: { birdsSaved: number, totalBirds: number, budgetLeft: number, satisfaction: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `作为一名资深生态学家，请评价玩家在《城市之翼》游戏中的表现：
        - 救助成功率: ${(stats.birdsSaved / stats.totalBirds * 100).toFixed(1)}%
        - 剩余预算: ${stats.budgetLeft}
        - 市民满意度: ${stats.satisfaction}%
        
        请写一段感人、科普且充满鼓励的总结陈词（约150字）。强调城市规划与生态共存的重要性，并给出一个基于现实的行动呼吁。`,
    });
    // Use .text property to extract content
    return response.text || "您的努力正在改变这座城市。每一只顺利飞过的候鸟都在感谢您的仁慈与智慧。让我们继续携手，为自然腾出空间。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "您的努力正在改变这座城市。每一只顺利飞过的候鸟都在感谢您的仁慈与智慧。让我们继续携手，为自然腾出空间。";
  }
};

export const getBirdFact = async (birdName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `关于 ${birdName}，提供三个简短且有趣的科普知识点，适合给玩游戏的学生看。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    // Ensure response.text is treated correctly as a string property
    const jsonStr = (response.text || "").trim();
    if (!jsonStr) throw new Error("Empty response");
    return JSON.parse(jsonStr).facts;
  } catch (error) {
    return ["它们是天生的长途旅行者。", "它们对环境变化非常敏感。", "它们依靠星光和地磁导航。"];
  }
};
