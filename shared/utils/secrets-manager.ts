import AWS from "aws-sdk";

const region = "us-east-2";
const secretName = "meru-secrets";

export async function getDbSecret() {
  const secretsClient = new AWS.SecretsManager({
    region: region,
  });

  const dbSecret = await secretsClient
    .getSecretValue({ SecretId: secretName })
    .promise();

  return dbSecret;
}
