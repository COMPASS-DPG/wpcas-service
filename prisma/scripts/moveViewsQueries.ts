const dbName = process.env.DATABASE_NAME;
const dbUserName = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbPort = process.env.DATABASE_PORT;
const dbHost = '172.17.0.1';

export const copyViewQueries = [
    `CREATE EXTENSION IF NOT EXISTS postgres_fdw`,
    `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_foreign_server
                WHERE srvname = 'wpcas_server'
            ) THEN
                EXECUTE 'CREATE SERVER wpcas_server
                        FOREIGN DATA WRAPPER postgres_fdw
                        OPTIONS (host ''${dbHost}'', dbname ''${dbName}'', port ''${dbPort}'')';
            END IF;
        END $$;
    `,
    `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_user_mappings
                WHERE srvname = 'wpcas_server' AND usename = '${dbUserName}'
            ) THEN
                EXECUTE 'CREATE USER MAPPING FOR ${dbUserName}
                        SERVER wpcas_server
                        OPTIONS (user ''${dbUserName}'', password ''${dbPassword}'')';
            END IF;
        END $$;
    `,
    `
        CREATE FOREIGN TABLE IF NOT EXISTS telemetry_user_details (
            "userId" TEXT,
            "userName" TEXT,
            "isAdmin" BOOLEAN,
            "position" TEXT,
            "surveyedCount" BIGINT,
            "surveysFilled" BIGINT,
            "surveysReceived" BIGINT,
            "surveysYetToBeFilled" BIGINT,
            "surveyResponseRate" BIGINT,
            "wpcasScore" DOUBLE PRECISION
        )
        SERVER wpcas_server
        OPTIONS (schema_name 'public', table_name 'telemetry_user_details');
    `,
    `
        CREATE FOREIGN TABLE IF NOT EXISTS position_competency_mapping (
            "designationId" INTEGER,
            "designationName" TEXT,
            "roleId" INTEGER,
            "roleName" TEXT,
            "competencyId" INTEGER,
            "competencyName" TEXT,
            "competencyLevelId" INTEGER,
            "competencyLevelName" TEXT,
            "competencyLevelNumber" INTEGER
        )
        SERVER wpcas_server
        OPTIONS (schema_name 'public', table_name 'position_competency_mapping');
    `,
    `
        CREATE FOREIGN TABLE IF NOT EXISTS metrics_wpcas_overall (
            "registeredUsers" BIGINT,
            "overallSurveysReceived" BIGINT,
            "overallSurveysCompleted" BIGINT,
            "unfilledSurveyCount" BIGINT,
            "overallSurveyNonResponseRate" BIGINT,
            "overallSurveyResponseRate" BIGINT,
            "timeStamp" date
        )
        SERVER wpcas_server
        OPTIONS (schema_name 'public', table_name 'metrics_wpcas_overall');
    `
];