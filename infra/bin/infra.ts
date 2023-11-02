#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TodoAppStack } from "../lib/infra-stack";

const app = new cdk.App();

new TodoAppStack(app, "TodoApp", {
  env: {
    account: "150450160980",
    region: "eu-central-1",
  },
});
