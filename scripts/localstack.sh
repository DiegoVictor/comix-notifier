REGION=us-east-1

# Run this "sls package" on host machine before start

awslocal dynamodb create-table \
  --table-name ComixNotifierConfigs \
  --key-schema AttributeName=id,KeyType=HASH \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --region $REGION \
  --billing-mode PAY_PER_REQUEST

awslocal dynamodb list-tables \
  --region $REGION

awslocal dynamodb put-item \
  --table-name ComixNotifierConfigs \
  --item '{
        "id": {
          "S": "49d18039-a514-4b3a-9af3-f124c0a803af"
        },
        "name": {
          "S": "urls"
        },
        "value": {
          "L": [
            {
              "S": "https://www.comix.com.br/mangas/m/my-hero-academia.html"
            }
          ]
        }
    }'

awslocal dynamodb scan --table-name ComixNotifierConfigs

awslocal sns create-topic --name ComixNotifierTopic
awslocal sns list-topics

awslocal sns create-platform-application --name ComixNotifier --platform GCM --attributes {}

# awslocal lambda delete-function --function-name ComixNotifierSubscribe
awslocal lambda create-function \
  --function-name ComixNotifierSubscribe \
  --runtime nodejs20.x \
  --zip-file fileb:///var/lib/localstack/functions/ComixNotifierSubscribe.zip \
  --handler src/functions/subscribe/handler.subscribe \
  --environment Variables={TOPIC_ARN=arn:aws:sns:us-east-1:000000000000:ComixNotifierTopic,ENDPOINT_URL=http://localstack:4566,PLATFORM_APPLICATION_ARN=arn:aws:sns:us-east-1:000000000000:app/GCM/ComixNotifier} \
  --role arn:aws:iam::000000000000:role/cool-stacklifter

awslocal lambda invoke --function-name ComixNotifierSubscribe \
  --payload '{"body":"{\"token\":\"3cae083d-0c1b-4006-8cbe-e485167ae84b\"}"}' \
  -

awslocal sns list-endpoints-by-platform-application --platform-application-arn arn:aws:sns:us-east-1:000000000000:app/GCM/ComixNotifier

# awslocal lambda delete-function --function-name ComixNotifierMain
awslocal lambda create-function \
  --function-name ComixNotifierMain \
  --runtime nodejs20.x \
  --zip-file fileb:///var/lib/localstack/functions/ComixNotifierMain.zip \
  --handler src/functions/main/handler.main \
  --environment Variables={CONFIG_TABLE=ComixNotifierConfigs,TOPIC_ARN=arn:aws:sns:us-east-1:000000000000:ComixNotifierTopic,ENDPOINT_URL=http://localstack:4566} \
  --role arn:aws:iam::000000000000:role/cool-stacklifter

awslocal lambda list-functions

awslocal events put-rule \
  --name ComixNotifierMainScheduleEvent \
  --schedule-expression 'rate(10 minutes)'

awslocal lambda add-permission \
  --function-name ComixNotifierMain \
  --statement-id ComixNotifierMainScheduleEvent \
  --action 'lambda:InvokeFunction' \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:us-east-1:000000000000:rule/ComixNotifierMainScheduleEvent

awslocal events put-targets \
  --rule ComixNotifierMainScheduleEvent \
  --targets '[{"Id":"1","Arn":"arn:aws:lambda:us-east-1:000000000000:function:ComixNotifierMain"}]'

# awslocal lambda invoke --function-name ComixNotifierMain output.txt
awslocal dynamodb scan --table-name ComixNotifierConfigs

curl "http://localhost:4566/_aws/sns/platform-endpoint-messages"
