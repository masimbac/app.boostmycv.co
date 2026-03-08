import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoClient, CVS_TABLE } from "./dynamodb";
import { CV, CVListItem, ParsedCVData } from "@/types/cv";

export class CVRepository {
  static async create(cv: CV): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: CVS_TABLE,
        Item: cv,
      })
    );
  }

  static async getById(cvId: string): Promise<CV | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: CVS_TABLE,
        Key: { cv_id: cvId },
      })
    );

    return (result.Item as CV) || null;
  }

  static async getByUserId(userId: string): Promise<CVListItem[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: CVS_TABLE,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        ProjectionExpression: "cv_id, cv_name, created_at, updated_at, version",
      })
    );

    return (result.Items || []) as CVListItem[];
  }

  static async update(
    cvId: string,
    cvName: string,
    parsedData: ParsedCVData
  ): Promise<void> {
    await dynamoClient.send(
      new UpdateCommand({
        TableName: CVS_TABLE,
        Key: { cv_id: cvId },
        UpdateExpression:
          "SET cv_name = :name, parsed_data = :data, updated_at = :updated, version = version + :inc",
        ExpressionAttributeValues: {
          ":name": cvName,
          ":data": parsedData,
          ":updated": new Date().toISOString(),
          ":inc": 1,
        },
      })
    );
  }

  static async delete(cvId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: CVS_TABLE,
        Key: { cv_id: cvId },
      })
    );
  }

  static async countUserCVs(userId: string): Promise<number> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: CVS_TABLE,
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
