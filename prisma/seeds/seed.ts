import { Prisma, PrismaClient } from "@prisma/client";
import { competencies } from "./data/mock-competencies.data";
import { competenciesToCompetencyLevels } from "./data/mock-competenciesToCompetencyLevels.data";
import { competencyLevels } from "./data/mock-competencyLevels.data";
import { designations } from "./data/mock-designation.data";
import { roles } from "./data/mock-roles.data";
import { rolesToCompetencies } from "./data/mock-rolesToCompetencies.data";
import { users } from "./data/mock-users.data";
import { Logger } from "@nestjs/common";
import { copyViewQueries } from "../scripts/moveViewsQueries";
import { createViewQueries } from "../scripts/createViewQueries";
const { Client } = require('pg');

const prisma = new PrismaClient();
const telemetryDbName = process.env.TELEMETRY_DATABASE_NAME;

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

async function createViews() {
  let logger = new Logger("CreatingViews");
  logger.log(`Started creating views`);

  for (const sql of createViewQueries) {
    logger.log(sql);
    await prisma.$executeRaw`${Prisma.raw(sql)}`;
  }

  const res:any = await prisma.$queryRaw`${Prisma.raw(`SELECT datname FROM pg_database WHERE datname = '${telemetryDbName}'`)}`;
  if (res.length === 0) {
    // Create the telemetry-views database if it does not exist
    await prisma.$queryRaw`${Prisma.raw(`CREATE DATABASE "${telemetryDbName}"`)}`;
    logger.log(`Database "${telemetryDbName}" created.`);
  } else {
    logger.log(`Database "${telemetryDbName}" already exists.`);
  }

  logger.log(`Successfully created views`);
}

async function moveViews() {
  let logger = new Logger("MovingViews");

  const telemetryClient =  new Client({
    user: process.env.DATABASE_USERNAME,
    host: '172.17.0.1',
    database: process.env.TELEMETRY_DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  });

  await telemetryClient.connect();

  logger.log(copyViewQueries);

  logger.log(`Started moving views`);
  
  for (const sql of copyViewQueries) {
    logger.log(sql);
    await telemetryClient.query(sql);
  }

  await telemetryClient.end();

  logger.log(`Successfully moved views`);
}

// execute the functions
async function main() {
  try {
    // await seed();
    await createViews();
    await moveViews();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
