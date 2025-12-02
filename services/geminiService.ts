
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BMCData, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    executiveSummary: { type: Type.STRING },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    segmentAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          segment: { type: Type.STRING },
          feedback: { type: Type.STRING },
          score: { type: Type.NUMBER },
        },
        required: ["segment", "feedback", "score"],
      },
    },
    riskAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          probability: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          mitigation: { type: Type.STRING }
        },
        required: ["risk", "impact", "probability", "mitigation"]
      }
    },
    kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
    marketingStrategy: {
      type: Type.OBJECT,
      properties: {
        tagline: { type: Type.STRING },
        topChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
        growthHack: { type: Type.STRING }
      },
      required: ["tagline", "topChannels", "growthHack"]
    },
    elevatorPitch: { type: Type.STRING },
    departmentalActionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          department: { type: Type.STRING },
          roles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["role", "tasks"]
            }
          }
        },
        required: ["department", "roles"]
      }
    }
  },
  required: ["overallScore", "executiveSummary", "swot", "suggestions", "segmentAnalysis", "riskAnalysis", "kpis", "marketingStrategy", "elevatorPitch", "departmentalActionPlan"],
};

export const analyzeBMC = async (data: BMCData): Promise<AnalysisResult> => {
  const promptText = `
    Analyze the following Business Model Canvas (BMC) data provided in Bengali/English. 
    Act as a world-class business consultant.
    Provide the output strictly in Bengali language (Bangla).
    
    Data:
    - Key Partners: ${data.keyPartners}
    - Key Activities: ${data.keyActivities}
    - Key Resources: ${data.keyResources}
    - Value Propositions: ${data.valuePropositions}
    - Customer Relationships: ${data.customerRelationships}
    - Channels: ${data.channels}
    - Customer Segments: ${data.customerSegments}
    - Cost Structure: ${data.costStructure}
    - Revenue Streams: ${data.revenueStreams}

    **Instruction for Action Plan:**
    Create a detailed Action Plan assigning specific tasks to the following roles based on the business analysis:

    1. **Management (ব্যবস্থাপনা):**
       - **Managing Director/CEO:** Strategy, Vision, Budget monitoring.
    
    2. **Marketing & Sales (মার্কেটিং ও বিক্রয়):**
       - **Marketing Manager:** Branding, Digital Campaigns (SEO/SEM), Offline marketing.
       - **Sales Team Lead:** Customer communication, Closing sales, Corporate clients.
    
    3. **Operations (অপারেশন):**
       - **Operations Manager:** Logistics, Supplier contracts.
       - **Tour Coordinator / Agent:** Booking, Itinerary, Visa processing.
       - **Customer Service Officer:** Inquiries, Problem solving.
    
    4. **Finance (অর্থ ও হিসাব):**
       - **Finance Manager:** Budgeting, Accounts, Profitability check.

    5. **Technology (প্রযুক্তি):**
       - **IT Administrator:** Website, CRM maintenance.

    Provide a JSON response with the following structure:
    {
      "overallScore": number (0-100),
      "executiveSummary": "string",
      "swot": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      },
      "suggestions": ["string"],
      "segmentAnalysis": [
        { "segment": "string", "feedback": "string", "score": number }
      ],
      "riskAnalysis": [
        { "risk": "string", "impact": "High/Medium/Low", "probability": "High/Medium/Low", "mitigation": "string (How to solve)" }
      ],
      "kpis": ["string (Key metrics to track success, e.g. CAC, LTV)"],
      "marketingStrategy": {
        "tagline": "string (A catchy slogan in Bangla)",
        "topChannels": ["string"],
        "growthHack": "string (One specific creative idea to grow fast)"
      },
      "elevatorPitch": "string (A 30-second persuasive pitch for investors in Bangla)",
      "departmentalActionPlan": [
        {
           "department": "string (e.g. Marketing & Sales)",
           "roles": [
              {
                "role": "string (e.g. Marketing Manager)",
                "tasks": ["string (Specific actionable todo item)"]
              }
           ]
        }
      ]
    }
  `;

  try {
    // Attempt 1: Strict JSON Schema
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: 'user', parts: [{ text: promptText }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text from AI");

  } catch (error) {
    console.warn("Schema generation failed, falling back to text generation...", error);
    
    // Attempt 2: Fallback to plain text JSON generation
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { role: 'user', parts: [{ text: promptText + "\n\nRETURN ONLY VALID JSON. Do not include markdown formatting like ```json" }] },
        });

        const text = response.text || "";
        // Clean up markdown code blocks if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        
        return JSON.parse(jsonString) as AnalysisResult;
    } catch (fallbackError) {
        console.error("Fallback failed:", fallbackError);
        throw fallbackError;
    }
  }
};
