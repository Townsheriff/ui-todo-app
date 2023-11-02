import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ConnectionTable extends Construct {
  public readonly table: cdk.aws_dynamodb.TableV2;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new cdk.aws_dynamodb.TableV2(this, "Table", {
      tableName: "ConnectionsTableV3",
      partitionKey: {
        name: "connectionId",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "id",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "topic",
      partitionKey: {
        name: "topic",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    this.table.addGlobalSecondaryIndex({
      indexName: "connectionId",
      partitionKey: {
        name: "connectionId",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });
  }
}
