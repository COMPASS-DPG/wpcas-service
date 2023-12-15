export interface IAnswerScore {
  score: number;
  totalQuestions: number;
}

export interface IGroupScoreData extends IAnswerScore {
  competencyId: number;
  competencyLevelNumber: number;
  scorePercentage: number;
}
