#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { SqsMd5AttrsStack } from "../lib/sqsmd5attrs-stack.js";

const app = new App();
new SqsMd5AttrsStack(app, "SqsMd5AttrsStack", {});