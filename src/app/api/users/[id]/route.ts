import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: String(params.id),
      },
      include: {
        subjects: true, 
      },
    });


    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuário.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};


export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  const body: User = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: String(params.id),
      },
      data: {
        email: body.email,
        password: body.password,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: String(params.id),
      },
    });

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
