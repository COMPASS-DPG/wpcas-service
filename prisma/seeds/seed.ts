import { PrismaClient } from "@prisma/client";
import { competencies } from "./data/mock-competencies.data";
import { competenciesToCompetencyLevels } from "./data/mock-competenciesToCompetencyLevels.data";
import { competencyLevels } from "./data/mock-competencyLevels.data";
import { designations } from "./data/mock-designation.data";
import { roles } from "./data/mock-roles.data";
import { rolesToCompetencies } from "./data/mock-rolesToCompetencies.data";
import { users } from "./data/mock-users.data";

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction([
    prisma.designation.createMany({
      data: designations,
    }),

    prisma.role.createMany({
      data: roles,
    }),
    
    prisma.competencyLevel.createMany({
      data: competencyLevels,
    }),

    prisma.competency.createMany({
      data: competencies,
    }),

    prisma.competencyToCompetencyLevel.createMany({
      data: competenciesToCompetencyLevels,
    }),

    prisma.roleToCompetency.createMany({
      data: rolesToCompetencies,
    }),

    prisma.user.createMany({
      data: users,
    }),
  ]);
}

seed()
  .catch((error) => {
    console.log("\n\n Seeding error:--------", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("\n\n Seeding stopped/completed");
    prisma.$disconnect();
  });
