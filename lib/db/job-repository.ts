import { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "./dynamodb";
import { Job, JobListItem } from "@/types/job";

const JOBS_TABLE = process.env.DYNAMODB_JOBS_TABLE_NAME || "boostmycv-jobs";

export class JobRepository {
  static async create(job: Job): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: JOBS_TABLE,
        Item: job,
      })
    );
  }

  static async getById(jobId: string): Promise<Job | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: JOBS_TABLE,
        Key: { job_id: jobId },
      })
    );

    return result.Item ? (result.Item as Job) : null;
  }

  static async getByUserId(userId: string): Promise<JobListItem[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: JOBS_TABLE,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    if (!result.Items) return [];

    return result.Items.map((item) => ({
      job_id: item.job_id,
      job_title: item.job_title,
      company: item.company,
      created_at: item.created_at,
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async update(
    jobId: string,
    updates: Partial<Job>
  ): Promise<void> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "job_id" && key !== "user_id" && value !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    if (updateExpressions.length === 0) return;

    // Always update updated_at
    updateExpressions.push("#updated_at = :updated_at");
    expressionAttributeNames["#updated_at"] = "updated_at";
    expressionAttributeValues[":updated_at"] = new Date().toISOString();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: JOBS_TABLE,
        Key: { job_id: jobId },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  }

  static async delete(jobId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: JOBS_TABLE,
        Key: { job_id: jobId },
      })
    );
  }

  static async countUserJobs(userId: string): Promise<number> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: JOBS_TABLE,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        Select: "COUNT",
      })
    );

    return result.Count || 0;
  }
}
