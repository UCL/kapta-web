import { Stack, StackProps } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class RequestsAPItoDynamo extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// Create DynamoDB Table
		const requestsTable = new dynamodb.Table(this, "RequestsTable", {
			partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
			tableName: "requests",
		});

		// Define lambda that will handle all routes
		const requestsLambda = new lambda.Function(this, "RequestsHandler", {
			runtime: lambda.Runtime.NODEJS_18_X,
			handler: "requestApi.handler",
			code: lambda.Code.fromAsset("lambda"),
			environment: {
				TABLE_NAME: requestsTable.tableName,
			},
		});

		// Grant Lambda functions permissions to access DynamoDB table
		requestsTable.grantReadWriteData(requestsLambda);

		// Create API Gateway using LambdaRestApi (this means all routes are handled by one lambda)
		const api = new apigateway.LambdaRestApi(this, "RequestsApi", {
			handler: requestsLambda,
			proxy: false, // Allows custom routes to be added
		});

		// Define /requests route for GET and PUT requests
		const requests = api.root.addResource("requests");
		requests.addMethod("GET");
		requests.addMethod("PUT");

		// Define /requests/{id} route for GET and DELETE requests
		const requestById = requests.addResource("{id}");
		requestById.addMethod("GET");
		requestById.addMethod("DELETE");
	}
}
