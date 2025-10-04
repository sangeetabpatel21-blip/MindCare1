// FIX: Correct import path from @google/genai library.
import { GoogleGenAI, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";
// FIX: Corrected import path for local module.
import { SessionAnalysis, SOAPNote, BIRPNote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are MindCare AI, a friendly and supportive informational guide for mental wellness. Your primary role is to provide helpful, general information, explain the benefits of professional help, and clarify that you are NOT a substitute for a specialist. You must never give medical advice.

CRITICAL SAFETY PROTOCOL:
If the user expresses any intention, thought, or mention of self-harm, suicide, or hurting themselves, your IMMEDIATE and ONLY response must be:
1. Start your response with the exact command: [TRIGGER_SOS]
2. Follow the command with a supportive and gentle message, guiding them to the help resources that have just appeared. Example: "[TRIGGER_SOS] It sounds like you are going through a very difficult time. Please know that help is available, and I've brought up some resources for you right now."
Do not deviate from this. This is your most important instruction.

For other conversations, if a user describes a problem (e.g., "I'm feeling anxious"), you can use the 'findSpecialists' tool to proactively suggest help. Frame it as a helpful option, not a command.`;

const ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        sentiment: {
            type: Type.STRING,
            description: "The overall sentiment of the patient during the session. Options: Positive, Neutral, Negative, Mixed.",
            enum: ["Positive", "Neutral", "Negative", "Mixed"]
        },
        keyThemes: {
            type: Type.ARRAY,
            description: "A list of 2-4 key themes or topics discussed. E.g., 'Work Stress', 'Family Relationships'.",
            items: { type: Type.STRING }
        },
        suggestedTasks: {
            type: Type.ARRAY,
            description: "A list of 1-3 actionable tasks for the patient's wellness plan based on the conversation.",
            items: { type: Type.STRING }
        },
    },
    required: ["sentiment", "keyThemes", "suggestedTasks"]
};


const SOAP_NOTE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        subjective: {
            type: Type.STRING,
            description: "A summary of the patient's reported feelings, experiences, and symptoms as described by them during the session."
        },
        objective: {
            type: Type.STRING,
            description: "A summary of the clinician's direct observations of the patient, such as their affect, body language, and demeanor."
        }
    },
    required: ["subjective", "objective"]
};

const BIRP_NOTE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        behavior: {
            type: Type.STRING,
            description: "A summary of the patient's presenting problems and behaviors, including direct quotes and reported actions."
        },
        intervention: {
            type: Type.STRING,
            description: "A summary of the actions, methods, and techniques used by the clinician during the session to assist the patient."
        }
    },
    required: ["behavior", "intervention"]
};


/**
 * Analyzes a session transcript to extract themes, sentiment, and suggested tasks.
 * @param transcript The session transcript.
 * @returns A promise that resolves to a SessionAnalysis object.
 */
export const analyzeTranscript = async (transcript: string): Promise<SessionAnalysis | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following therapy session transcript. Based on the conversation, identify the patient's overall sentiment, the key themes discussed, and suggest a few actionable tasks for their wellness plan.\n\nTranscript:\n${transcript}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: ANALYSIS_SCHEMA
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SessionAnalysis;

    } catch (error) {
        console.error('Error analyzing transcript:', error);
        return null;
    }
}


/**
 * Summarizes a given text using the Gemini API.
 * @param textToSummarize The text to be summarized.
 * @returns A promise that resolves to the summarized text.
 */
export const summarizeText = async (textToSummarize: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following session transcript into a few concise bullet points, focusing on patient's reported feelings, key topics discussed, and actionable next steps or goals. Keep it brief and clinical:\n\n${textToSummarize}`
    });
    return response.text;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return 'Error: Could not generate summary.';
  }
};


export const findSpecialistsTool: FunctionDeclaration = {
    name: 'findSpecialists',
    description: 'Finds mental health specialists based on user criteria like specialty, consultation mode, or type.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            specialties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'The specific conditions or areas of expertise (e.g., "Anxiety", "Depression").'
            },
            modes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'The consultation mode, e.g., "Online" or "In-person".'
            },
             type: {
                type: Type.STRING,
                description: 'The type of specialist, e.g., "Psychologist", "Counselor", "Therapist".'
            }
        },
    }
};

/**
 * Sends a chat message to the Gemini API with function calling enabled. Used for text chat.
 * @param message The user's message.
 * @returns A promise that resolves to the API response.
 */
export const sendChatMessage = async (message: string): Promise<GenerateContentResponse> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations: [findSpecialistsTool] }],
        },
    });
    return response;
}

/**
 * Sends a chat message to the Gemini API and returns a streaming response. Used for voice mode.
 * @param message The user's message.
 * @returns An async iterable stream of GenerateContentResponse chunks.
 */
export const sendChatMessageStream = async (message: string) => {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        }
    });
    return response;
};


/**
 * Generates a draft for session progress notes (SOAP or BIRP) from a transcript.
 * @param transcript The session transcript.
 * @param format The desired note format ('SOAP' or 'BIRP').
 * @returns A promise that resolves to a partial note object.
 */
export const generateSessionNotes = async (transcript: string, format: 'SOAP' | 'BIRP'): Promise<Partial<SOAPNote & BIRPNote> | null> => {
    try {
        const isSoap = format === 'SOAP';
        const schema = isSoap ? SOAP_NOTE_SCHEMA : BIRP_NOTE_SCHEMA;
        const prompt = `
You are an AI assistant for a mental healthcare specialist. Your task is to generate draft clinical progress notes from a session transcript. Use a professional, concise, and clinically relevant tone, avoiding jargon.

The requested format is: ${format}.

**SOAP Format Instructions:**
- **Subjective:** Document the client’s reported symptoms, feelings, and experiences from the transcript.
- **Objective:** Document the clinician's direct observations of the client (e.g., mood, behavior, affect, mental status) as described or implied in the transcript.

**BIRP Format Instructions:**
- **Behavior:** Document the client's presenting problems and behaviors, including direct quotes and reported actions from the transcript.
- **Intervention:** Document the actions, methods, and techniques used by the clinician during the session as described in the transcript.

**CRITICAL INSTRUCTIONS:**
1. The output MUST be a valid JSON object following the provided schema.
2. ONLY extract and summarize information from the provided transcript. Do NOT invent information.
3. Do NOT fill fields that require clinical assessment, diagnosis, or planning (like Assessment, Plan, or Response). Your role is to draft the observational parts of the note only.

**Session Transcript:**
${transcript}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Partial<SOAPNote & BIRPNote>;

    } catch (error) {
        console.error('Error generating session notes:', error);
        return null;
    }
};

/**
 * Generates reflective process notes from a session transcript.
 * @param transcript The session transcript.
 * @returns A promise that resolves to the process notes as a string.
 */
export const generateProcessNotes = async (transcript: string): Promise<string | null> => {
    try {
        const prompt = `
You are an AI assistant for a mental healthcare specialist, tasked with drafting reflective process notes based on a client session transcript. Your goal is to capture the therapist’s potential clinical thoughts, hypotheses, and reflections on the session dynamics. The output should be a flexible narrative format.

Include reflections on:
- **Clinical Hypotheses:** What underlying issues or patterns might be at play?
- **Client-Therapist Interactions:** Note moments of strong rapport, resistance, or transference/countertransference.
- **Emotional Responses:** What were the therapist's internal reactions to the client's statements?
- **Breakthroughs or Stuck Points:** Identify key moments of insight or areas where the client seemed resistant to change.
- **Session Dynamics:** Comment on the overall flow and energy of the session.

**IMPORTANT:**
- Write from the perspective of the therapist reflecting on the session.
- Keep the language professional but also personal and insightful.
- This is a draft for the therapist's private records.

**Session Transcript:**
${transcript}

**Draft Process Notes:**`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error('Error generating process notes:', error);
        return null;
    }
};