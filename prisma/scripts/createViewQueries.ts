export const createViewQueries = [
    `
        DROP VIEW IF EXISTS telemetry_user_details
    `,

    `
        DROP VIEW IF EXISTS position_competency_mapping
    `,

    `
        DROP VIEW IF EXISTS metrics_wpcas_overall
    `,

    `
        CREATE VIEW telemetry_user_details AS
        SELECT 
            u."userId",
            u."userName",
            u."isAdmin",
            u.designation AS position,
            COUNT(rt_surveyed.id) FILTER (WHERE rt_surveyed.status = 'COMPLETED') AS "surveyedCount",
            COUNT(rt_filled.id) FILTER (WHERE rt_filled.status = 'COMPLETED') AS "surveysFilled",
            COUNT(rt_received.id) AS "surveysReceived",
            COUNT(rt_pending.id) FILTER (WHERE rt_pending.status = 'PENDING') AS "surveysYetToBeFilled",
            COALESCE(NULLIF(COUNT(rt_filled.id) FILTER (WHERE rt_filled.status = 'COMPLETED'), 0) / NULLIF(COUNT(rt_received.id), 0), 0) AS "surveyResponseRate",
            COALESCE(
                (
                    SELECT ss.score
                    FROM survey_scores ss
                    JOIN survey_form sf ON ss."surveyFormId" = sf.id
                    WHERE sf."userId" = u."userId"
                    ORDER BY sf."createdAt" DESC
                    LIMIT 1
                ), null
            ) AS "wpcasScore"
        FROM 
            "UserMetadata" u
        LEFT JOIN 
            response_tracker rt_surveyed ON rt_surveyed."assesseeId" = u."userId"
        LEFT JOIN 
            response_tracker rt_filled ON rt_filled."assessorId" = u."userId"
        LEFT JOIN 
            response_tracker rt_received ON rt_received."assesseeId" = u."userId"
        LEFT JOIN 
            response_tracker rt_pending ON rt_pending."assessorId" = u."userId"
        GROUP BY 
            u."userId", u."userName", u."designation", u."isAdmin"
    `,

    `
        CREATE VIEW position_competency_mapping AS
        SELECT
            d.id AS "designationId",
            d.name AS "designationName",
            r.id AS "roleId",
            r.name AS "roleName",
            c.id AS "competencyId",
            c.name AS "competencyName",
            cl.id AS "competencyLevelId",
            cl.name AS "competencyLevelName",
            cl."levelNumber" AS "competencyLevelNumber"
        FROM
            designations d
        JOIN
            "DesignationToRole" dr ON d.id = dr."designationId"
        JOIN
            roles r ON dr."roleId" = r.id
        JOIN
            "RoleToCompetency" rc ON r.id = rc."roleId"
        JOIN
            competencies c ON rc."competencyId" = c.id
        JOIN
            "CompetencyToCompetencyLevel" ccl ON c.id = ccl."competencyId"
        JOIN
            competency_levels cl ON ccl."competencyLevelId" = cl.id
        ORDER BY 
            d.id, r.id, c.id, cl.id, cl."levelNumber"
    `,            

    `
        CREATE VIEW metrics_wpcas_overall AS
        SELECT 
            (SELECT COUNT(*) FROM "UserMetadata") AS "registeredUsers",
            (SELECT COUNT(*) FROM response_tracker) AS "overallSurveysReceived",
            (SELECT COUNT(*) FROM response_tracker WHERE status = 'COMPLETED') AS "overallSurveysCompleted",
            (SELECT COUNT(*) FROM response_tracker WHERE status = 'PENDING') AS "unfilledSurveyCount",
            COALESCE(NULLIF((SELECT COUNT(*) FROM response_tracker WHERE status = 'PENDING'), 0) / NULLIF((SELECT COUNT(*) FROM response_tracker), 0), 0) AS "overallSurveyNonResponseRate",
            COALESCE(NULLIF((SELECT COUNT(*) FROM response_tracker WHERE status = 'COMPLETED'), 0) / NULLIF((SELECT COUNT(*) FROM response_tracker), 0), 0) AS "overallSurveyResponseRate"
    `
];