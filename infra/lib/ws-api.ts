import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { ApiGatewayv2DomainProperties } from "aws-cdk-lib/aws-route53-targets";

export type BackendAppProps = {
  wsApiDomainName: string;
  cloudfrontDomainName: string;
  hostedZone: cdk.aws_route53.IHostedZone;
};

export class WsApi extends Construct {
  public wsApiDomainName: string;
  public webSocketApi: apigateway.WebSocketApi;
  public wsHandler: cdk.aws_lambda.Function;

  public websocketEndpoint: string;

  constructor(scope: Construct, id: string, props: BackendAppProps) {
    super(scope, id);

    this.wsApiDomainName = props.wsApiDomainName;

    const code = cdk.aws_lambda.Code.fromDockerBuild("../backend/", {
      targetStage: "messageHandler",
      imagePath: "/backend/dist",
      platform: "linux/amd64",
    });

    this.wsHandler = new cdk.aws_lambda.Function(this, "MessageHandler", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      handler: "messageHandler.handler",
      code: code,
    });

    this.webSocketApi = new apigateway.WebSocketApi(this, "WebSocketApi", {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ConnectIntegration",
          this.wsHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DisconnectIntegration",
          this.wsHandler
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "MessageIntegration",
          this.wsHandler
        ),
      },
    });

    const certificate = new cdk.aws_certificatemanager.Certificate(
      this,
      "WsCertificate",
      {
        domainName: props.wsApiDomainName,
        validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(
          props.hostedZone
        ),
        subjectAlternativeNames: [props.cloudfrontDomainName],
      }
    );

    const domainName = new apigateway.DomainName(this, "WsDomainName", {
      certificate,
      domainName: props.wsApiDomainName,
    });

    const stage = new apigateway.WebSocketStage(this, `WsStage`, {
      domainMapping: {
        domainName: domainName,
      },
      webSocketApi: this.webSocketApi,
      stageName: "Default",
      autoDeploy: true,
    });

    this.websocketEndpoint = `https://${this.webSocketApi.apiId}.execute-api.eu-central-1.amazonaws.com/${stage.stageName}`;

    new cdk.aws_route53.ARecord(this, "WsApiAliasARecord", {
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          domainName.regionalDomainName,
          domainName.regionalHostedZoneId
        )
      ),
      zone: props.hostedZone,
      recordName: props.wsApiDomainName,
    });
  }
}
