"use server";

import { prisma } from "@repo/db"
import { getSession } from "../auth";

export async function sendMessageToRoom(roomId: string, content: string) {

  const session = await getSession();

  if (!session?.user) throw new Error("Unauthorized"); 
  const userId = session.user.id;
    
  const message = await prisma.message.create({
      data: {
        userId,
        roomId,
        content,
      },
      include: {
        user: true,
      },
    });

    return message;
}

export async function sendDirectMessage(receiverId: string, content: string) {

  const session = await getSession();

  if (!session?.user) throw new Error("Unauthorized"); 
  const userId = session.user.id;
  
  let conversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          userId: { in: [userId, receiverId] },
        },
      },
    },
  });
  
  
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { user: { connect: { id: userId } } },
              { user: { connect: { id: receiverId } } },
            ],
          },
        },
      });
    }
  
    const directMessage =  await prisma.directMessage.create({
      data: {
        senderId: userId,
        receiverId,
        conversationId: conversation.id,
        content,
      },
      include: {
        sender: true,
      },
    });

    return directMessage;
  }