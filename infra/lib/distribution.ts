import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { RestApi } from "./rest-app";
import { FrontendApp } from "./frontend-app";

export type DistributionProps = {
  restApi: RestApi;
  frontendApp: FrontendApp;
  hostedZone: cdk.aws_route53.IHostedZone;
  cloudfrontDomainName: string;
};

export class Distribution extends Construct {
  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    const certificate = new cdk.aws_certificatemanager.DnsValidatedCertificate(
      this,
      "Certificate",
      {
        domainName: props.cloudfrontDomainName,
        hostedZone: props.hostedZone,
        region: "us-east-1",
        validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(
          props.hostedZone
        ),
      }
    );

    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      "Distribution",
      {
        domainNames: [props.cloudfrontDomainName],
        certificate: certificate,
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responsePagePath: "/index.html",
            responseHttpStatus: 500,
          },
        ],
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(
            props.frontendApp.appBucket
          ),
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          "/api/*": {
            origin: new cdk.aws_cloudfront_origins.HttpOrigin(
              props.restApi.restApi.domainName!.domainName
            ),
            viewerProtocolPolicy:
              cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
            cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
            originRequestPolicy:
              cdk.aws_cloudfront.OriginRequestPolicy
                .ALL_VIEWER_EXCEPT_HOST_HEADER,
          },
        },
      }
    );

    const invalidateCommand = {
      action: "createInvalidation",
      service: "CloudFront",

      parameters: {
        DistributionId: distribution.distributionId,
        InvalidationBatch: {
          CallerReference: `${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/*"],
          },
        },
      },
    };

    const invalidateCache = new cdk.custom_resources.AwsCustomResource(
      this,
      "Invalidation",
      {
        role: new cdk.aws_iam.Role(this, "InvalidationRole", {
          assumedBy: new cdk.aws_iam.ServicePrincipal("lambda.amazonaws.com"),
        }),
        onCreate: {
          ...invalidateCommand,
          physicalResourceId:
            cdk.custom_resources.PhysicalResourceId.of("InvalidateCache"),
        },
        onUpdate: invalidateCommand,
      }
    );

    distribution.grantCreateInvalidation(invalidateCache);

    new cdk.aws_route53.ARecord(this, "ApiAliasARecord", {
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(distribution)
      ),
      zone: props.hostedZone,
      recordName: props.cloudfrontDomainName,
    });

    new cdk.aws_route53.AaaaRecord(this, "ApiAliasAAAARecord", {
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(distribution)
      ),
      zone: props.hostedZone,
      recordName: props.cloudfrontDomainName,
    });
  }
}
