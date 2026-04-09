import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "./dynamodb";
import { Boost, BoostListItem } from "@/types/boost";

const BOOSTS_TABLE =
  process.env.DYNAMODB_BOOSTS_TABLE_NAME || "boostmycv-boosts";

export class BoostRepository {
  static async create(boost: Boost): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: BOOSTS_TABLE,
        Item: boost,
      })
    );
  }

  static async getById(boostId: string): Promise<Boost | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: BOOSTS_TABLE,
        Key: { boost_id: boostId },
      })
    );

    return result.Item ? (result.Item as Boost) : null;
  }

  static async getByUserId(userId: string): Promise<BoostListItem[]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: BOOSTS_TABLE,
        IndexName: "user_id-index",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    const boosts = (result.Items || []) as Boost[];

    // Map to list items
    return boosts.map((boost) => ({
      boost_id: boost.boost_id,
      cv_name: boost.cv_name,
      job_title: boost.job_title,
      changes_count: boost.changes.length,
      status: boost.status,
      created_at: boost.created_at,
    }));
  }

  static async getByScoreId(scoreId: string): Promise<Boost | null> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: BOOSTS_TABLE,
        IndexName: "score_id-index",
        KeyConditionExpression: "score_id = :scoreId",
        ExpressionAttributeValues: {
          ":scoreId": scoreId,
        },
      })
    );

    const boosts = result.Items || [];
    return boosts.length > 0 ? (boosts[0] as Boost) : null;
  }

  static async update(
    boostId: string,
    updates: Partial<Boost>
  ): Promise<void> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updates).forEach((key, index) => {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] =
        updates[key as keyof typeof updates];
    });

    if (updateExpressions.length === 0) return;

    await dynamoClient.send(
      new UpdateCommand({
        TableName: BOOSTS_TABLE,
        Key: { boost_id: boostId },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  }

  static async delete(boostId: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: BOOSTS_TABLE,
        Key: { boost_id: boostId },
      })
    );
  }

  static async updateChangeAcceptance(
    boostId: string,
    changeId: string,
    accepted: boolean
  ): Promise<void> {
    // Get the boost first
    const boost = await this.getById(boostId);
    if (!boost) {
      throw new Error("Boost not found");
    }

    // Update the specific change
    const updatedChanges = boost.changes.map((change) => {
      if (change.change_id === changeId) {
        return { ...change, accepted };
      }
      return change;
    });

    // Count accepted/rejected
    const changes_accepted = updatedChanges.filter((c) => c.accepted).length;
    const changes_rejected = updatedChanges.filter((c) => !c.accepted).length;

    // Update the boost
    await this.update(boostId, {
      changes: updatedChanges,
      changes_accepted,
      changes_rejected,
    });
  }

  static async updateStatus(
    boostId: string,
    status: "pending" | "applied" | "rejected",
    appliedAt?: string,
    boostedCvVersion?: number
  ): Promise<void> {
    const updates: Partial<Boost> = {
      status,
      ...(appliedAt && { applied_at: appliedAt }),
      ...(boostedCvVersion !== undefined && {
        boosted_cv_version: boostedCvVersion,
      }),
    };

    await this.update(boostId, updates);
  }
}
