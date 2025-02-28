"use server";

import { prisma } from "@repo/db"
import { getSession } from "../auth";

export async function sendMessageToRoom(roomId: string, content: string) {

  const session = await getSession();

  if (!session?.user) return {
    error: "You are not signed in!",
    status: 401
  }
  const userId = session.user.id;

  try {
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

    return {
      status: 200
    }
  } catch (e) {
    console.log("An unexpected error occurred while sending the message: ", e);
    return {
      error: e,
      status: 400
    }
  }
    
  
}

export async function sendDirectMessage(receiverId: string, content: string) {

  const session = await getSession();

  if (!session?.user) return {
    error: "You are not signed in!",
    status: 401
  }
  const userId = session.user.id;

  try {
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
  } catch(e) {
    console.log("An unknown error occurred! - ", e)
    return {
      error: e,
      status: 400
    }
  }
}

export async function createRoom(roomName: string) {
  const session = await getSession();

  if (!session?.user) return {
    error: "You are not signed in!",
    status: 401
  }

  const userId = session.user.id;

  const existingRoom = await prisma.room.findFirst({
    where: {
      name: roomName,
      participants: {
        some: {
          userId: userId
        }
      }
    }
  })

  if (existingRoom) {
    return {
      message: "You are already in this room. You cannot create it again.",
      status: 409
    }
  }

  await prisma.room.create({
    data: {
      name: roomName,
      createdById: userId,
      participants: {
        create: {
          userId: userId
        }
      }
    }
  });

  return {
    message: "Room created succesfully",
    status: 200
  };
}

export async function getUserRooms() {
  const session = await getSession();

  if (!session?.user) return {
    message: "You are not signed in!",
    status: 401
  }

  const userId = session.user.id;

  const rooms = await prisma.room.findMany({
    where: {
      participants: {
        some: {
          userId: userId
        }
      }
    }
  })

  return {
    rooms,
    status: 200
  }
}