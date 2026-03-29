import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

// GET /api/ecoach - get conversations
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const conversations = await prisma.eCoachConversation.findMany({
      where: { clientId: userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('E-Coach GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/ecoach - send message (with mock AI response)
const messageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const data = messageSchema.parse(body);

    let conversationId = data.conversationId;

    // Create new conversation if needed
    if (!conversationId) {
      const convo = await prisma.eCoachConversation.create({
        data: {
          clientId: userId,
          title: data.message.substring(0, 50),
        },
      });
      conversationId = convo.id;
    }

    // Save user message
    await prisma.eCoachMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: data.message,
      },
    });

    // Generate AI response (mock for now - replace with actual AI integration)
    const aiResponse = generateMockResponse(data.message);

    const assistantMessage = await prisma.eCoachMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: aiResponse,
      },
    });

    await prisma.eCoachConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      conversationId,
      message: assistantMessage,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('E-Coach POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('pain') || lower.includes('hurt')) {
    return "I'm sorry to hear you're experiencing discomfort. On a scale of 0-10, how would you rate your pain? If it's above 5/10 or feels sharp, I'd recommend contacting your therapist. In the meantime, applying ice for 15 minutes may help reduce inflammation.";
  }

  if (lower.includes('exercise') || lower.includes('workout')) {
    return "Great that you're staying active! Remember to warm up for at least 5 minutes before starting your assigned exercises. Focus on proper form over speed, and stop if you feel any sharp pain. Would you like me to walk you through today's routine?";
  }

  if (lower.includes('diet') || lower.includes('food') || lower.includes('eat')) {
    return "Nutrition plays a big role in recovery! Make sure you're getting enough protein (aim for 1.2-1.6g per kg body weight) to support muscle repair. Stay hydrated with at least 2L of water daily. Would you like some meal ideas?";
  }

  if (lower.includes('progress') || lower.includes('better')) {
    return "It's great to check in on your progress! Recovery is a journey, and every small improvement counts. Based on your recent workout logs, you're showing consistent improvements. Keep up the great work! 💪";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm your AI E-Coach, here to support your wellness journey. I can help with exercise guidance, pain management tips, nutrition advice, and tracking your progress. What can I help you with today?";
  }

  return "Thank you for reaching out! I'm here to support your wellness journey. I can help with:\n\n• Exercise guidance and form tips\n• Pain management advice\n• Progress tracking\n• Nutrition tips\n• Appointment reminders\n\nWhat would you like to focus on?";
}
