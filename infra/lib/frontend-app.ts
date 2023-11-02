import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export type FrontendAppProps = {
  graphqlUrl: string;
  graphqlWs: string;
};
export class FrontendApp extends Construct {
  public readonly appBucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: FrontendAppProps) {
    super(scope, id);

    this.appBucket = new cdk.aws_s3.Bucket(this, "Bucket");

    const bundle = cdk.aws_s3_deployment.Source.asset("../frontend", {
      bundling: {
        image: cdk.DockerImage.fromBuild("../frontend/", {
          targetStage: "builder",
          platform: "linux/amd64",
          buildArgs: {
            GRAPHQL_URL: props.graphqlUrl,
            GRAPHQL_WS: props.graphqlWs,
          },
        }),
        command: ["bash", "-c", "cp -r /frontend/dist/* /asset-output/"],
      },
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [bundle],
      destinationBucket: this.appBucket,
    });
  }
}
