import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class TodoListTable extends Construct {
  public readonly table: cdk.aws_dynamodb.TableV2;
  public readonly handler: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new cdk.aws_dynamodb.TableV2(this, "Table", {
      tableName: "TodoListTableV2",
      dynamoStream: cdk.aws_dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      partitionKey: {
        name: "pk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "id", type: cdk.aws_dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.table.addLocalSecondaryIndex({
      indexName: "insertOrder",
      sortKey: {
        name: "insertOrder",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    const code = cdk.aws_lambda.Code.fromDockerBuild("../backend/", {
      targetStage: "streamHandler",
      imagePath: "/backend/dist",
      platform: "linux/amd64",
    });

    this.handler = new cdk.aws_lambda.Function(this, "EventHandler", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      handler: "streamHandler.handler",
      code: code,
    });

    this.handler.addEventSource(
      new cdk.aws_lambda_event_sources.DynamoEventSource(this.table, {
        startingPosition: cdk.aws_lambda.StartingPosition.TRIM_HORIZON,
      })
    );
  }
}
