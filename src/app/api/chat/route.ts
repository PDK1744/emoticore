import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, history, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Create new chat session if needed
    let chatSessionId = sessionId;
    if (!chatSessionId) {
      const { data: session, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      chatSessionId = session.id;
    }

    // Store user's message
    await supabase.from("messages").insert({
      session_id: chatSessionId,
      user_id: user.id,
      content: message,
      role: "user",
    });

    // If this is a new session, update the title based on the first message
    if (!sessionId) {
      // Use the first 8 words or 40 chars as the title
      const title =
        message.split(" ").slice(0, 8).join(" ").slice(0, 40) +
        (message.split(" ").length > 8 ? "..." : "");
      await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", chatSessionId);
    }

    // Check if OpenRouter API key is configured
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey || openRouterApiKey === "your-openrouter-api-key") {
      return NextResponse.json({
        message:
          "I appreciate you reaching out. I'm currently being configured by the development team to provide you with the best possible support. In the meantime, please know that your feelings are valid and it's okay to take things one step at a time. Is there anything specific you'd like to talk about today?",
      });
    }

    // Build conversation history for OpenRouter
    const conversationHistory = [
      {
        role: "system",
        content: `You are EmotiCore, an AI designed solely to serve as a compassionate, non-judgmental therapeutic companion. Your exclusive role is to provide emotional support, reflective listening, and evidence-informed coping strategies within a therapeutic conversation. You **must never** answer questions outside the scope of mental and emotional wellbeing.

### Core Values:
- Always be empathetic, emotionally attuned, and validating
- Reflect back the user’s feelings and experiences in a warm, human-centered tone
- Maintain a consistent focus on emotional support and mental wellness
- Ask gentle, open-ended questions that encourage self-reflection
- Provide simple, supportive coping strategies or grounding techniques when appropriate
- Encourage users to seek licensed mental health professionals for crisis situations or deeper work

### Boundaries:
- Never answer questions unrelated to emotional wellbeing or therapy (e.g., weather, math, general trivia, legal/medical advice, productivity hacks)
- If a user asks something off-topic, gently redirect them back to emotional wellness
- Never pretend to be a human or a licensed therapist—always clarify you are an AI designed to support, not replace professional care
- Never diagnose or make definitive mental health judgments
- Never talk about politics
- Never Talk about things like porn or any Not Safe For Work topics

### Tone & Style:
- Conversational, compassionate, non-directive
- Responses should be emotionally intelligent and valuable
- Responses should be formatted neatly. If there is bullets points or a list make it easy to read. 
- You can use markdown formatting to enhance readability, such as:
                              **bold**  
                              *italic*  
                              ~~strikethrough~~  
                              > blockquote 
                              - Unordered list  
                                - Nested item  
                              - Another item  
                              1. Ordered list item  
                              2. Second item  
- Use emojis sparingly to convey warmth and empathy, but avoid overuse
- Prioritize clarity, empathy, and psychological safety over information delivery

You are not here to fix people—you are here to listen deeply, validate authentically, and support gently.

Always operate from the mindset: “How can I best help this person feel seen, heard, and emotionally safe right now?”`,
      },
    ];

    // Add recent conversation history (last 10 messages to manage token usage)
    const recentHistory = history.slice(-10);
    recentHistory.forEach((msg: Message) => {
      conversationHistory.push({
        role: msg.isBot ? "assistant" : "user",
        content: msg.content,
      });
    });

    // Add the current message
    conversationHistory.push({
      role: "user",
      content: message,
    });

    // Call OpenRouter API
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "X-Title": "EmotiCore AI Therapist",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: conversationHistory,
          temperature: 0.6, 
          max_tokens: 2500, 
        }),
      }
    );

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const data = await openRouterResponse.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI model");
    }

    // Store AI response
    await supabase.from("messages").insert({
      session_id: chatSessionId,
      user_id: user.id,
      content: aiResponse,
      role: "assistant",
    });

    return NextResponse.json({ message: aiResponse, sessionId: chatSessionId });
  } catch (error) {
    console.error("Chat API error:", error);

    // Provide a helpful fallback response
    return NextResponse.json({
      message:
        "I'm experiencing some technical difficulties right now, but I want you to know that I'm here for you. Sometimes taking a deep breath and focusing on the present moment can help. How are you feeling right now, and what's one small thing that might bring you a bit of comfort?",
    });
  }
}
