import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type RestApiProps = {
  restApiDomainName: string;
  cloudfrontDomainName: string;
  hostedZone: cdk.aws_route53.IHostedZone;
};

export class RestApi extends Construct {
  public restApi: cdk.aws_apigateway.RestApi;
  public apiHandler: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string, props: RestApiProps) {
    super(scope, id);

    const code = cdk.aws_lambda.Code.fromDockerBuild("../backend/", {
      targetStage: "apolloHandler",
      imagePath: "/backend/dist",
      platform: "linux/amd64",
    });

    this.apiHandler = new cdk.aws_lambda.Function(this, "Handler", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      handler: "apolloHandler.handler",
      code: code,
      memorySize: 2048,
    });

    const certificate = new cdk.aws_certificatemanager.Certificate(
      this,
      "Certificate",
      {
        domainName: props.restApiDomainName,
        validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(
          props.hostedZone
        ),
        subjectAlternativeNames: [props.cloudfrontDomainName],
      }
    );

    this.restApi = new cdk.aws_apigateway.LambdaRestApi(this, "RestApi", {
      handler: this.apiHandler,
      proxy: true,
      domainName: {
        certificate: certificate,
        domainName: props.restApiDomainName,
      },
      endpointTypes: [cdk.aws_apigateway.EndpointType.REGIONAL],
    });

    new cdk.aws_route53.ARecord(this, "ApiAliasARecord", {
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.ApiGateway(this.restApi)
      ),
      zone: props.hostedZone,
      recordName: props.restApiDomainName,
    });

    new cdk.aws_route53.AaaaRecord(this, "ApiAliasAAAARecord", {
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.ApiGateway(this.restApi)
      ),
      zone: props.hostedZone,
      recordName: props.restApiDomainName,
    });
  }
}
