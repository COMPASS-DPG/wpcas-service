-- CreateEnum
CREATE TYPE "SurveyStatusEnum" AS ENUM ('CREATED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ResponseTrackerStatusEnum" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TimeUnitsEnum" AS ENUM ('DAY', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "UserRolesEnum" AS ENUM ('ADMIN', 'COMSUMER');

-- CreateTable
CREATE TABLE "UserMetadata" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "isNewEmployee" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "competencyId" INTEGER NOT NULL,
    "competencyLevelId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_config" (
    "id" SERIAL NOT NULL,
    "maxQuestions" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_parameters" (
    "id" SERIAL NOT NULL,
    "onboardingTime" INTEGER NOT NULL,
    "onboardingTimeUnit" "TimeUnitsEnum" NOT NULL,
    "surveyCycle" INTEGER NOT NULL,

    CONSTRAINT "survey_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_form" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionsJson" JSONB NOT NULL,
    "surveyConfigId" INTEGER NOT NULL,
    "status" "SurveyStatusEnum" NOT NULL,

    CONSTRAINT "survey_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_tracker" (
    "id" SERIAL NOT NULL,
    "surveyFormId" INTEGER NOT NULL,
    "assesseeId" INTEGER NOT NULL,
    "assessorId" INTEGER NOT NULL,
    "responseJson" JSONB,
    "status" "ResponseTrackerStatusEnum" NOT NULL,

    CONSTRAINT "response_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_scores" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "surveyFormId" INTEGER NOT NULL,
    "roleId" INTEGER,
    "competencyId" INTEGER NOT NULL,
    "competencyLevelId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "survey_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRolesEnum" NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "levelId" INTEGER,
    "teamId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "lable" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" SERIAL NOT NULL,
    "competencyName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_levels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competency_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CompetencyToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CompetencyToCompetencyLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_userId_key" ON "UserMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_competencyLevelId_question_key" ON "question_bank"("competencyLevelId", "question");

-- CreateIndex
CREATE UNIQUE INDEX "survey_form_surveyConfigId_key" ON "survey_form"("surveyConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "response_tracker_surveyFormId_assesseeId_assessorId_key" ON "response_tracker"("surveyFormId", "assesseeId", "assessorId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetencyToRole_AB_unique" ON "_CompetencyToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetencyToRole_B_index" ON "_CompetencyToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetencyToCompetencyLevel_AB_unique" ON "_CompetencyToCompetencyLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetencyToCompetencyLevel_B_index" ON "_CompetencyToCompetencyLevel"("B");

-- AddForeignKey
ALTER TABLE "survey_form" ADD CONSTRAINT "survey_form_surveyConfigId_fkey" FOREIGN KEY ("surveyConfigId") REFERENCES "survey_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_tracker" ADD CONSTRAINT "response_tracker_surveyFormId_fkey" FOREIGN KEY ("surveyFormId") REFERENCES "survey_form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_scores" ADD CONSTRAINT "survey_scores_surveyFormId_fkey" FOREIGN KEY ("surveyFormId") REFERENCES "survey_form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyToRole" ADD CONSTRAINT "_CompetencyToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyToRole" ADD CONSTRAINT "_CompetencyToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyToCompetencyLevel" ADD CONSTRAINT "_CompetencyToCompetencyLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyToCompetencyLevel" ADD CONSTRAINT "_CompetencyToCompetencyLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "competency_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
