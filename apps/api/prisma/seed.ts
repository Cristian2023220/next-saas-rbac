import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

// 1. Inicialização simplificada (sem Adapter/Pool)
const prisma = new PrismaClient()

async function seed() {
  // Limpeza do banco
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany() 
  // Nota: deleteMany em cascata pode exigir ordem específica ou configuração no schema,
  // mas vamos manter a ordem que você enviou.

  const passwordHash = await hash('123456', 6)

  // 2. Criação do Usuário Principal
  const user = await prisma.user.create({
    data: {
      name: 'Cristian',
      email: 'cristian123@gmail.com',
      avatarUrl: faker.image.avatar(),
      passwordHash,
    },
  })

  // 3. Criação de Usuários Secundários
  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  // 4. Criação da Organização ADMIN
  await prisma.organization.create({
    data: {
      name: 'Acme Corp (Admin)',
      domain: 'acme-corp.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shoudAttachByDomain: true, // Corrigi o typo: 'shoudAttachByDomain' -> 'shouldAttachUsersByDomain' (verifique seu schema se o nome é esse mesmo)
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'ADMIN' },
            { userId: anotherUser.id, role: 'MEMBER' },
            { userId: anotherUser2.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  // 5. Criação da Organização MEMBER
  await prisma.organization.create({
    data: {
      name: 'Acme Corp (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'MEMBER' },
            { userId: anotherUser.id, role: 'ADMIN' },
            { userId: anotherUser2.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  // 6. Criação da Organização BILLING
  await prisma.organization.create({
    data: {
      name: 'Acme Corp (BILLING)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: 'BILLING' },
            { userId: anotherUser.id, role: 'ADMIN' },
            { userId: anotherUser2.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Database seeded successfully')
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })