-- CreateEnum
CREATE TYPE "SurveyStatusEnum" AS ENUM ('CREATED', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ResponseTrackerStatusEnum" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TimeUnitsEnum" AS ENUM ('DAY', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "UserRolesEnum" AS ENUM ('ADMIN', 'CONSUMER');

-- CreateTable
CREATE TABLE "UserMetadata" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "isNewEmployee" BOOLEAN NOT NULL,
    "designation" TEXT,
    "dateOfJoining" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "UserMetadata_pkey" PRIMARY KEY ("id","userId")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "competencyId" INTEGER NOT NULL,
    "competencyLevelNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_competencies" (
    "id" SERIAL NOT NULL,
    "competencyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "competencyLevels" JSONB[],

    CONSTRAINT "admin_competencies_pkey" PRIMARY KEY ("id","competencyId")
);

-- CreateTable
CREATE TABLE "survey_config" (
    "id" SERIAL NOT NULL,
    "surveyName" TEXT NOT NULL,
    "onboardingTime" INTEGER NOT NULL DEFAULT 3,
    "onboardingTimeUnit" "TimeUnitsEnum" NOT NULL DEFAULT 'MONTH',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "survey_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMapping" (
    "id" SERIAL NOT NULL,
    "surveyConfigId" INTEGER NOT NULL,
    "assesseeId" UUID NOT NULL,
    "assessorIds" UUID[],

    CONSTRAINT "UserMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_form" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "questionsJson" JSONB NOT NULL,
    "surveyConfigId" INTEGER NOT NULL,
    "status" "SurveyStatusEnum" NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "sunbirdCredentialIds" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_tracker" (
    "id" SERIAL NOT NULL,
    "surveyFormId" INTEGER NOT NULL,
    "assesseeId" UUID NOT NULL,
    "assessorId" UUID NOT NULL,
    "responseJson" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "status" "ResponseTrackerStatusEnum" NOT NULL,

    CONSTRAINT "response_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_scores" (
    "id" SERIAL NOT NULL,
    "surveyFormId" INTEGER NOT NULL,
    "competencyId" INTEGER NOT NULL,
    "competencyLevelNumber" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "survey_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRolesEnum" NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designation" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designationId" INTEGER,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleToCompetency" (
    "roleId" INTEGER NOT NULL,
    "competencyId" INTEGER NOT NULL,

    CONSTRAINT "RoleToCompetency_pkey" PRIMARY KEY ("roleId","competencyId")
);

-- CreateTable
CREATE TABLE "competency_levels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "levelNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competency_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyToCompetencyLevel" (
    "competencyId" INTEGER NOT NULL,
    "competencyLevelId" INTEGER NOT NULL,

    CONSTRAINT "CompetencyToCompetencyLevel_pkey" PRIMARY KEY ("competencyId","competencyLevelId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_id_key" ON "UserMetadata"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_userId_key" ON "UserMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_userName_key" ON "UserMetadata"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_competencyId_competencyLevelNumber_question_key" ON "question_bank"("competencyId", "competencyLevelNumber", "question");

-- CreateIndex
CREATE UNIQUE INDEX "admin_competencies_competencyId_key" ON "admin_competencies"("competencyId");

-- CreateIndex
CREATE UNIQUE INDEX "survey_form_userId_surveyConfigId_key" ON "survey_form"("userId", "surveyConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "response_tracker_surveyFormId_assesseeId_assessorId_key" ON "response_tracker"("surveyFormId", "assesseeId", "assessorId");

-- CreateIndex
CREATE UNIQUE INDEX "survey_scores_surveyFormId_competencyId_competencyLevelNumb_key" ON "survey_scores"("surveyFormId", "competencyId", "competencyLevelNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Designation_name_key" ON "Designation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "competencies_name_key" ON "competencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "competency_levels_name_key" ON "competency_levels"("name");

-- AddForeignKey
ALTER TABLE "UserMapping" ADD CONSTRAINT "UserMapping_surveyConfigId_fkey" FOREIGN KEY ("surveyConfigId") REFERENCES "survey_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_form" ADD CONSTRAINT "survey_form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserMetadata"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_form" ADD CONSTRAINT "survey_form_surveyConfigId_fkey" FOREIGN KEY ("surveyConfigId") REFERENCES "survey_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_tracker" ADD CONSTRAINT "response_tracker_surveyFormId_fkey" FOREIGN KEY ("surveyFormId") REFERENCES "survey_form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_tracker" ADD CONSTRAINT "response_tracker_assesseeId_fkey" FOREIGN KEY ("assesseeId") REFERENCES "UserMetadata"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_tracker" ADD CONSTRAINT "response_tracker_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "UserMetadata"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_scores" ADD CONSTRAINT "survey_scores_surveyFormId_fkey" FOREIGN KEY ("surveyFormId") REFERENCES "survey_form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleToCompetency" ADD CONSTRAINT "RoleToCompetency_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleToCompetency" ADD CONSTRAINT "RoleToCompetency_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyToCompetencyLevel" ADD CONSTRAINT "CompetencyToCompetencyLevel_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyToCompetencyLevel" ADD CONSTRAINT "CompetencyToCompetencyLevel_competencyLevelId_fkey" FOREIGN KEY ("competencyLevelId") REFERENCES "competency_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
