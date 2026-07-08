import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// In-memory conversation store (use DB in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

const SYSTEM_PROMPT = `You are "Mediusware SEO Intelligence Assistant" — an expert AI chatbot embedded inside Mediusware's SEO Intelligence Dashboard.

Your role:
- Answer ANY question the user asks — SEO, marketing, web development, tech, business strategy, content, competitors, keywords, or general knowledge.
- When the question relates to SEO, content strategy, or digital marketing, provide actionable, specific, evidence-based advice.
- Reference the dashboard context when relevant (Mediusware is a software development company based in Bangladesh specializing in Microsoft Power Platform, SharePoint, Power BI, Azure, .NET, and custom enterprise software).
- Use a professional yet approachable tone. Be concise but thorough.
- Format responses with clear structure: bullet points, numbered lists, or headers when appropriate.
- If you don't know something, say so honestly rather than guessing.
- For SEO-specific questions, mention best practices, tools, and strategies relevant to B2B SaaS and IT services companies.

Key facts about Mediusware you should know:
- Domain Authority: 45 (growing)
- Main strengths: Microsoft Stack (Power Platform, SharePoint, Power BI, Azure)
- Key competitors: BrainStation-IT, DataSoft, TherapServices, Kaz Software, Cefalo
- Target markets: Enterprise clients needing custom software, ERP, CRM, and cloud solutions
- Content focus areas: Microsoft Stack tutorials, enterprise software guides, cloud migration, digital transformation`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId = "default" } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { error: "Message too long (max 4000 characters)" },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    // Get or create conversation history
    let history = conversations.get(sessionId) || [
      { role: "assistant", content: SYSTEM_PROMPT },
    ];

    // Add user message
    history.push({ role: "user", content: message.trim() });

    // Trim history to last 20 messages (keep system prompt)
    if (history.length > 20) {
      history = [history[0], ...history.slice(-(19))];
    }

    // Get AI completion
    const completion = await zai.chat.completions.create({
      messages: history.map((m) => ({
        role: m.role as "assistant" | "user",
        content: m.content,
      })),
      thinking: { type: "disabled" },
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    // Add AI response to history
    history.push({ role: "assistant", content: aiResponse });

    // Save updated history
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageCount: history.length - 1,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "default";
    conversations.delete(sessionId);
    return NextResponse.json({ success: true, message: "Conversation cleared" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to clear conversation" }, { status: 500 });
  }
}