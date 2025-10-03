import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data to avoid duplicates
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
  await prisma.module.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.enrollment.deleteMany();

  // Create 5 users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const password = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password,
        role: Role.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    users.push(user);
  }

  // Create courses and related data for each user
  for (const user of users) {
    const course = await prisma.course.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: parseFloat(faker.commerce.price()),
        instructorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create modules for the course
    for (let i = 0; i < 3; i++) {
      const module = await prisma.module.create({
        data: {
          title: faker.lorem.words(3),
          content: faker.lorem.paragraph(),
          courseId: course.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create quizzes for the module
      const quiz = await prisma.quiz.create({
        data: {
          moduleId: module.id,
          questions: JSON.stringify([
            { question: faker.lorem.sentence(), options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Enroll a user in the course
      await prisma.enrollment.create({
        data: {
          studentId: user.id,
          courseId: course.id,
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
