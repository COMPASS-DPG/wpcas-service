import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ResponseTrackerStatusEnum, SurveyStatusEnum } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { QuestionBankService } from "../question-bank/question-bank.service";
import { responseObject } from "../response-tracker/dto";
import { AnswerEnum } from "../response-tracker/enums/response-tracker.enums";
import { ResponseTrackerService } from "../response-tracker/response-tracker.service";
import { SurveyFormService } from "../survey-form/survey-form.service";
import _ from "lodash";
import { CreateSurveyScoreDto } from "./dto/create-survey-score.dto";
import { UpdateSurveyScoreDto } from "./dto/update-survey-score.dto";
import {
  IAnswerScore,
  IGroupScoreData,
} from "./interfaces/survey-score.interfaces";

@Injectable()
export class SurveyScoreService {
  constructor(
    private prisma: PrismaService,
    private responseTrackerService: ResponseTrackerService,
    private questionBankService: QuestionBankService,
    private surveyFormService: SurveyFormService
  ) {}

  public async create(createSurveyScoreDto: CreateSurveyScoreDto) {
    return await this.prisma.surveyScore.create({ data: createSurveyScoreDto });
  }

  public async findAll() {
    return await this.prisma.surveyScore.findMany();
  }

  public async findOne(id: number) {
    const surveyScore = await this.prisma.surveyScore.findUnique({
      where: {
        id,
      },
    });

    if (!surveyScore)
      throw new NotFoundException(`survey score with id #${id} not found`);
    return surveyScore;
  }

  public async findBySurveyFormId(surveyFormId: number) {
    const surveyScore = await this.prisma.surveyScore.findMany({
      where: { surveyFormId },
    });
    if (!surveyScore || surveyScore.length === 0)
      throw new NotFoundException(
        `Survey score for survey form id #${surveyFormId} not found`
      );
    return surveyScore;
  }

  public async update(id: number, updateSurveyScoreDto: UpdateSurveyScoreDto) {
    return await this.prisma.surveyScore.update({
      where: { id },
      data: updateSurveyScoreDto,
    });
  }

  public async remove(id: number) {
    return await this.prisma.surveyScore.delete({ where: { id } });
  }

  public async calculateSurveyScoreBySurveyFormId(
    surveyFormId: number
  ): Promise<String> {
    try {
      const surveyForm = await this.surveyFormService.findSurveyFormById(
        surveyFormId
      );

      if (surveyForm && surveyForm.status !== SurveyStatusEnum.CLOSED) {
        throw new BadRequestException(
          `Status for Survey form with id #${surveyFormId} is not ${SurveyStatusEnum.CLOSED}.`
        );
      }

      const completedSurveyResponses =
        await this.responseTrackerService.getAllResponseJsonBySurveyFormId(
          surveyFormId,
          ResponseTrackerStatusEnum.COMPLETED
        );

      const surveyResponses = _.compact(
        _.flatten(
          _.map(completedSurveyResponses, (response) => {
            const result = _.get(response, "responseJson", []);
            return !_.isEmpty(result) ? result : null;
          })
        )
      );

      if (_.isEmpty(surveyResponses)) {
        const surveyQuestionIds = _.map(
          JSON.parse(JSON.stringify(surveyForm.questionsJson)),
          (question) => _.get(question, "questionId")
        );

        const emptyResponseScorePayload = await this.fetchEmptyResponseScores(
          surveyQuestionIds,
          surveyFormId
        );

        await this.prisma.surveyScore.createMany({
          data: emptyResponseScorePayload,
        });

        return `Successfully calculated score for survey form id #${surveyFormId}`;
      }

      const answerScore = this.calculateAnswerScore(_.compact(surveyResponses));

      const answerScoreAndCompetencyGroupData: {
        [key: string]: IGroupScoreData;
      } = await this.getAnswerScoreAndCompetencyGroupData(answerScore);

      const groupedScoreDataByCompetency = this.groupScoreDataByCompetency(
        answerScoreAndCompetencyGroupData
      );

      const finalGroupedData = Object.values(groupedScoreDataByCompetency).map(
        (group: IGroupScoreData) => ({
          ...group,
          scorePercentage: Number(
            ((group.score / group.totalQuestions || 0) * 100).toFixed(2)
          ),
        })
      );

      const overallScore =
        this.calculateOverAllScoreFromFinalGropedData(finalGroupedData);

      if (overallScore) {
        await this.surveyFormService.updateSurveyFormScore(
          surveyFormId,
          overallScore
        );
      }

      const scorePayload = this.formatScorePayloadFromFinalGroupDataAndFormId(
        surveyFormId,
        finalGroupedData
      );

      await this.prisma.surveyScore.createMany({
        data: scorePayload,
      });

      return `Successfully calculated score for survey form id #${surveyFormId}`;
    } catch (error) {
      throw error;
    }
  }

  public async fetchEmptyResponseScores(
    questionIds: number[],
    surveyFormId: number
  ) {
    return Promise.all(
      questionIds.map(async (surveyQuestionId) => {
        const question = await this.questionBankService.getQuestionById(
          surveyQuestionId
        );
        const { competencyId, competencyLevelNumber } = question;
        return {
          surveyFormId,
          competencyId,
          competencyLevelNumber,
          score: -1,
        };
      })
    );
  }

  public calculateAnswerScore(surveyResponses: responseObject[]): {
    [key: string]: IAnswerScore;
  } {
    if (_.isEmpty(surveyResponses)) {
      return {}; // Return an empty object when surveyResponses is empty
    }

    const groupedResponses = _.groupBy(surveyResponses, "questionId");

    const answerScores = _.mapValues(groupedResponses, (responses) => {
      const totalQuestions = _.sumBy(responses, (response) =>
        response.answer === AnswerEnum.DO_NOT_KNOW ? 0 : 1
      );

      const score = _.sumBy(responses, (response) =>
        response.answer === AnswerEnum.YES ? 1 : 0
      );

      return { score, totalQuestions };
    });

    return answerScores;
  }

  public async getAnswerScoreAndCompetencyGroupData(answerScore: {
    [key: string]: IAnswerScore;
  }): Promise<{ [key: string]: IGroupScoreData }> {
    if (_.isEmpty(answerScore)) {
      return {}; // Return an empty object when answerScore is empty
    }

    const questionIds = Object.keys(answerScore);

    // Use _.map to create an array of promises for each iteration
    const promises = _.map(questionIds, async (questionId) => {
      const question = await this.questionBankService.getQuestionById(
        +questionId
      );
      const { competencyId, competencyLevelNumber } = question;

      const scoreData = answerScore[questionId];

      return [
        questionId,
        {
          score: scoreData.score,
          totalQuestions: scoreData.totalQuestions,
          competencyId,
          competencyLevelNumber,
          scorePercentage: 0,
        },
      ];
    });

    // Wait for all promises to resolve using Promise.all
    const results = await Promise.all(promises);

    // Use _.fromPairs to transform the results array into an object
    return _.fromPairs(results);
  }

  public groupScoreDataByCompetency(groupedData: {
    [key: string]: IGroupScoreData;
  }): { [key: string]: IGroupScoreData } {
    if (_.isEmpty(groupedData)) {
      return {}; // Return an empty object when groupedData is empty
    }

    return _.values(groupedData).reduce((acc, item) => {
      const key = `${item.competencyId}-${item.competencyLevelNumber}`;

      acc[key] = acc[key] || {
        score: 0,
        totalQuestions: 0,
        competencyId: item.competencyId,
        competencyLevelNumber: item.competencyLevelNumber,
      };

      acc[key].score += item.score;
      acc[key].totalQuestions += item.totalQuestions;

      return acc;
    }, {});
  }

  public calculateOverAllScoreFromFinalGropedData(
    finalGroupedData: IGroupScoreData[]
  ): number | null {
    if (_.isEmpty(finalGroupedData)) {
      return null; // Return null default value for an empty payload
    }

    const overallScore = _.reduce(
      finalGroupedData,
      (acc, group) => {
        acc.score += group.score;
        acc.totalQuestions += group.totalQuestions;
        return acc;
      },
      { score: 0, totalQuestions: 0 }
    );

    return Number(
      ((overallScore.score / overallScore.totalQuestions) * 100).toFixed(2)
    );
  }

  public formatScorePayloadFromFinalGroupDataAndFormId(
    surveyFormId: number,
    finalGroupedData: IGroupScoreData[]
  ) {
    if (_.isEmpty(finalGroupedData)) {
      return []; // Return an empty array or any other appropriate default value for an empty payload
    }

    return _.map(finalGroupedData, (data) => {
      const { competencyId, competencyLevelNumber, scorePercentage } = data;
      return {
        surveyFormId,
        competencyId,
        competencyLevelNumber,
        score: scorePercentage,
      };
    });
  }

  public async getAllSurveyScoreByUserId(userId: string) {
    const surveyScoreResponse =
      await this.surveyFormService.getAllSurveyFormScoresByUserId(userId);

    if (!surveyScoreResponse)
      throw new NotFoundException(
        `Survey scores not found for user id #${userId}`
      );

    return _.map(surveyScoreResponse, (data) => {
      const { id, ...rest } = data;
      return { surveyFormId: id, ...rest };
    });
  }

  public async getLatestSurveyScoreByUserId(userId: string) {
    const latestSurveyScore =
      await this.surveyFormService.getLatestSurveyFormScoresByUserId(userId);

    if (!latestSurveyScore)
      throw new NotFoundException(
        `Survey score not found for user id #${userId}`
      );

    const { id, ...rest } = latestSurveyScore;
    return { surveyFormId: id, ...rest };
  }
}
