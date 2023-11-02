import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { TodoListTable } from "./todo-list-table";
import { FrontendApp } from "./frontend-app";
import { RestApi } from "./rest-app";
import { Distribution } from "./distribution";
import { ConnectionTable } from "./connection-table";
import { WsApi } from "./ws-api";

export class TodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "todo-app.avtspace.com";
    const restApiDomainName = "api.todo-app.avtspace.com";
    const wsApiDomainName = "ws.todo-app.avtspace.com";
    const hostedZoneId = "Z0100209L4ZCEOUDWQR6";

    const hostedZone = cdk.aws_route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hostedZoneId,
        zoneName: domainName,
      }
    );

    const connTable = new ConnectionTable(this, "ConnectionTable");
    const todoListTable = new TodoListTable(this, "TodoListTable");

    const frontendApp = new FrontendApp(this, "FrontendApp", {
      graphqlUrl: `https://${domainName}/api/`,
      graphqlWs: `wss://${wsApiDomainName}/`,
    });

    const restApi = new RestApi(this, "RestApi", {
      cloudfrontDomainName: domainName,
      hostedZone: hostedZone,
      restApiDomainName: restApiDomainName,
    });

    const wsApi = new WsApi(this, "WsApi", {
      cloudfrontDomainName: domainName,
      hostedZone: hostedZone,
      wsApiDomainName: wsApiDomainName,
    });

    new Distribution(this, "Distribution", {
      restApi: restApi,
      frontendApp: frontendApp,
      cloudfrontDomainName: domainName,
      hostedZone: hostedZone,
    });

    restApi.apiHandler.addEnvironment(
      "TODO_LIST_TABLE",
      todoListTable.table.tableName
    );

    wsApi.wsHandler.addEnvironment(
      "CONNECTION_TABLE_NAME",
      connTable.table.tableName
    );

    todoListTable.handler.addEnvironment(
      "CONNECTION_TABLE_NAME",
      connTable.table.tableName
    );

    todoListTable.handler.addEnvironment(
      "WS_API_ENDPOINT",
      wsApi.websocketEndpoint
    );

    wsApi.wsHandler.addEnvironment("WS_API_ENDPOINT", wsApi.websocketEndpoint);

    connTable.table.grantReadWriteData(wsApi.wsHandler);
    connTable.table.grantReadWriteData(todoListTable.handler);

    todoListTable.table.grantReadWriteData(restApi.apiHandler);

    wsApi.webSocketApi.grantManageConnections(todoListTable.handler);
    wsApi.webSocketApi.grantManageConnections(wsApi.wsHandler);
  }
}
