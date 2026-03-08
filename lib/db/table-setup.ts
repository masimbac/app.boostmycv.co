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
