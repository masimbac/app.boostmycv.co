import { PutCommand, GetCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "./dynamodb";
import { Score, ScoreListItem } from "@/types/score";

const SCORES_TABLE = process.env.DYNAMODB_SCORES_TABLE_NAME || "boostmycv-scores";

export class ScoreRepository {
  static async create(score: Score): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: SCORES_TABLE,
        Item: score,
      })
    );
  }

  static async getById(scoreId: string): Promise<Score | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: SCORES_TABLE,
        Key: { score_id: scoreId },
      })
    );

    return result.Item ? (result.Item as Score) : null;
  }

  static async getByUserId(userId: string): Promise<ScoreListItem[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: SCORES_TABLE,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    if (!result.Items) return [];

    return result.Items.map((item) => ({
      score_id: item.score_id,
      cv_name: item.cv_name,
      job_title: item.job_title,
      overall_score: item.overall_score,
      created_at: item.created_at,
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getByCvId(cvId: string): Promise<ScoreListItem[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: SCORES_TABLE,
        IndexName: "cv_id-index",
        KeyConditionExpression: "cv_id = :cvId",
        ExpressionAttributeValues: {
          ":cvId": cvId,
        },
      })
    );

    if (!result.Items) return [];

    return result.Items.map((item) => ({
      score_id: item.score_id,
      cv_name: item.cv_name,
      job_title: item.job_title,
      overall_score: item.overall_score,
      created_at: item.created_at,
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getByJobId(jobId: string): Promise<ScoreListItem[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: SCORES_TABLE,
        IndexName: "job_id-index",
        KeyConditionExpression: "job_id = :jobId",
        ExpressionAttributeValues: {
          ":jobId": jobId,
        },
      })
    );

    if (!result.Items) return [];

    return result.Items.map((item) => ({
      score_id: item.score_id,
      cv_name: item.cv_name,
      job_title: item.job_title,
      overall_score: item.overall_score,
      created_at: item.created_at,
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async delete(scoreId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: SCORES_TABLE,
        Key: { score_id: scoreId },
      })
    );
  }

  static async countUserScoresThisMonth(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: SCORES_TABLE,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :userId",
        FilterExpression: "created_at >= :startDate",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":startDate": startOfMonth.toISOString(),
        },
        Select: "COUNT",
      })
    );

    return result.Count || 0;
  }
}
