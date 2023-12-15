import { SurveyScoreCredentailDto } from "../dto";

export const schema = {
  $schema: "https://json-schema.org/draft/2019-09/schema",
  description:
    "The individual has achieved a <PERCENTAGE/GRADE> score in the most recent peer survey.",
  type: "object",
  properties: {
    dateOfSurveyScore: {
      type: "string",
    },
    overallScore: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    competencies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          levels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                score: {
                  type: "number",
                  minimum: 0,
                  maximum: 100,
                },
              },
              required: ["name", "score"],
            },
          },
        },
        required: ["id", "name", "levels"],
      },
    },
    userId: {
      type: "string",
    },
  },
  required: ["dateOfSurveyScore", "overallScore", "competencies", "userId"],
  additionalProperties: true,
};


export const createSchema = (id: string) => {
  return {
    $id: id,
    ...schema,
  }
};