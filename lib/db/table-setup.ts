import {
  CreateTableCommand,
  DescribeTableCommand,
  UpdateTableCommand,
  ResourceNotFoundException,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function ensureCVsTable(): Promise<void> {
  const tableName = process.env.DYNAMODB_CVS_TABLE_NAME || "boostmycv-cvs";

  try {
    const tableDescription = await client.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    console.log(`Table ${tableName} exists`);

    // Check if the GSI exists
    const hasGSI = tableDescription.Table?.GlobalSecondaryIndexes?.some(
      (gsi) => gsi.IndexName === "user_id-index"
    );

    if (!hasGSI) {
      console.log(`Adding user_id-index GSI to table ${tableName}...`);
      await client.send(
        new UpdateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "user_id", AttributeType: "S" },
          ],
          GlobalSecondaryIndexUpdates: [
            {
              Create: {
                IndexName: "user_id-index",
                KeySchema: [
                  { AttributeName: "user_id", KeyType: "HASH" },
                ],
                Projection: {
                  ProjectionType: "ALL",
                },
                ProvisionedThroughput: {
                  ReadCapacityUnits: 5,
                  WriteCapacityUnits: 5,
                },
              },
            },
          ],
        })
      );
      console.log(`GSI user_id-index added successfully`);
    }
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      console.log(`Creating table ${tableName}...`);

      await client.send(
        new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "cv_id", AttributeType: "S" },
            { AttributeName: "user_id", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "cv_id", KeyType: "HASH" }],
          GlobalSecondaryIndexes: [
            {
              IndexName: "user_id-index",
              KeySchema: [
                { AttributeName: "user_id", KeyType: "HASH" },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );

      console.log(`Table ${tableName} created successfully`);
    } else {
      throw error;
    }
  }
}

export async function ensureJobsTable(): Promise<void> {
  const tableName = process.env.DYNAMODB_JOBS_TABLE_NAME || "boostmycv-jobs";

  try {
    const tableDescription = await client.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    console.log(`Table ${tableName} exists`);

    // Check if the GSI exists
    const hasGSI = tableDescription.Table?.GlobalSecondaryIndexes?.some(
      (gsi) => gsi.IndexName === "user_id-index"
    );

    if (!hasGSI) {
      console.log(`Adding user_id-index GSI to table ${tableName}...`);
      await client.send(
        new UpdateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "user_id", AttributeType: "S" },
          ],
          GlobalSecondaryIndexUpdates: [
            {
              Create: {
                IndexName: "user_id-index",
                KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
                Projection: {
                  ProjectionType: "ALL",
                },
                ProvisionedThroughput: {
                  ReadCapacityUnits: 5,
                  WriteCapacityUnits: 5,
                },
              },
            },
          ],
        })
      );
      console.log(`GSI user_id-index added successfully`);
    }
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      console.log(`Creating table ${tableName}...`);

      await client.send(
        new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "job_id", AttributeType: "S" },
            { AttributeName: "user_id", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "job_id", KeyType: "HASH" }],
          GlobalSecondaryIndexes: [
            {
              IndexName: "user_id-index",
              KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
              Projection: {
                ProjectionType: "ALL",
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );

      console.log(`Table ${tableName} created successfully`);
    } else {
      throw error;
    }
  }
}

export async function ensureScoresTable(): Promise<void> {
  const tableName =
    process.env.DYNAMODB_SCORES_TABLE_NAME || "boostmycv-scores";

  try {
    const tableDescription = await client.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    console.log(`Table ${tableName} exists`);

    // Check if GSIs exist
    const gsiNames =
      tableDescription.Table?.GlobalSecondaryIndexes?.map(
        (gsi) => gsi.IndexName
      ) || [];
    const missingGSIs = [];

    if (!gsiNames.includes("user_id-index")) {
      missingGSIs.push({
        IndexName: "user_id-index",
        KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" as const }],
        Projection: { ProjectionType: "ALL" as const },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });
    }

    if (!gsiNames.includes("cv_id-index")) {
      missingGSIs.push({
        IndexName: "cv_id-index",
        KeySchema: [{ AttributeName: "cv_id", KeyType: "HASH" as const }],
        Projection: { ProjectionType: "ALL" as const },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });
    }

    if (!gsiNames.includes("job_id-index")) {
      missingGSIs.push({
        IndexName: "job_id-index",
        KeySchema: [{ AttributeName: "job_id", KeyType: "HASH" as const }],
        Projection: { ProjectionType: "ALL" as const },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });
    }

    if (missingGSIs.length > 0) {
      console.log(`Adding missing GSIs to table ${tableName}...`);

      // Add GSIs one at a time (DynamoDB limitation)
      for (const gsi of missingGSIs) {
        await client.send(
          new UpdateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
              {
                AttributeName: gsi.KeySchema[0].AttributeName,
                AttributeType: "S",
              },
            ],
            GlobalSecondaryIndexUpdates: [{ Create: gsi }],
          })
        );
        console.log(`GSI ${gsi.IndexName} added successfully`);
        // Wait a bit between GSI additions
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      console.log(`Creating table ${tableName}...`);

      await client.send(
        new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "score_id", AttributeType: "S" },
            { AttributeName: "user_id", AttributeType: "S" },
            { AttributeName: "cv_id", AttributeType: "S" },
            { AttributeName: "job_id", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "score_id", KeyType: "HASH" }],
          GlobalSecondaryIndexes: [
            {
              IndexName: "user_id-index",
              KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
            {
              IndexName: "cv_id-index",
              KeySchema: [{ AttributeName: "cv_id", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
            {
              IndexName: "job_id-index",
              KeySchema: [{ AttributeName: "job_id", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );

      console.log(`Table ${tableName} created successfully`);
    } else {
      throw error;
    }
  }
}

export async function ensureBoostsTable(): Promise<void> {
  const tableName =
    process.env.DYNAMODB_BOOSTS_TABLE_NAME || "boostmycv-boosts";

  try {
    const tableDescription = await client.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    console.log(`Table ${tableName} exists`);

    // Check if GSIs exist
    const gsiNames =
      tableDescription.Table?.GlobalSecondaryIndexes?.map(
        (gsi) => gsi.IndexName
      ) || [];
    const missingGSIs = [];

    if (!gsiNames.includes("user_id-index")) {
      missingGSIs.push({
        IndexName: "user_id-index",
        KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" as const }],
        Projection: { ProjectionType: "ALL" as const },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });
    }

    if (!gsiNames.includes("score_id-index")) {
      missingGSIs.push({
        IndexName: "score_id-index",
        KeySchema: [{ AttributeName: "score_id", KeyType: "HASH" as const }],
        Projection: { ProjectionType: "ALL" as const },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });
    }

    if (missingGSIs.length > 0) {
      console.log(`Adding missing GSIs to table ${tableName}...`);

      // Add GSIs one at a time
      for (const gsi of missingGSIs) {
        await client.send(
          new UpdateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
              {
                AttributeName: gsi.KeySchema[0].AttributeName,
                AttributeType: "S",
              },
            ],
            GlobalSecondaryIndexUpdates: [{ Create: gsi }],
          })
        );
        console.log(`GSI ${gsi.IndexName} added successfully`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      console.log(`Creating table ${tableName}...`);

      await client.send(
        new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: "boost_id", AttributeType: "S" },
            { AttributeName: "user_id", AttributeType: "S" },
            { AttributeName: "score_id", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "boost_id", KeyType: "HASH" }],
          GlobalSecondaryIndexes: [
            {
              IndexName: "user_id-index",
              KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
            {
              IndexName: "score_id-index",
              KeySchema: [{ AttributeName: "score_id", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );

      console.log(`Table ${tableName} created successfully`);
    } else {
      throw error;
    }
  }
}
