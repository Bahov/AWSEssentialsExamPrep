import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AwsEssentialsExamPrep from '../lib/aws_essentials_exam_prep-stack';
import 'jest-cdk-snapshot';

test('Test Stack', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new AwsEssentialsExamPrep.AwsEssentialsExamPrepStack(app, 'MyTestStack');
  expect(stack).toMatchCdkSnapshot()
  });

