variable "name" {
  description = "The name of the sqs that separates deployment vs tenant sqs."
}

resource "aws_sqs_queue" "sqs" {
  name = "${var.name}-sqs"
  delay_seconds = "0"
  max_message_size = "262144"
  message_retention_seconds = "1209600"
  visibility_timeout_seconds = "180"
  receive_wait_time_seconds = "0"
}

resource "aws_sns_topic" "sns" {
  name = "${var.name}-topic"
}

resource "aws_sns_topic_subscription" "sns_sqs_subscription" {
  topic_arn = "${aws_sns_topic.sns.arn}"
  protocol  = "sqs"
  endpoint  = "${aws_sqs_queue.sqs.arn}"
}

resource "aws_sqs_queue_policy" "sqs_policy" {
  queue_url = "${aws_sqs_queue.sqs.id}"
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "${var.name}-sqspolicy",
  "Statement": [
    {
      "Sid": "SNSToSQSPolicy",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.sqs.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.sns.arn}"
        }
      }
    }
  ]
}
POLICY
}


output "sqs_arn" {
  value = "${aws_sqs_queue.sqs.arn}"
}

output "sns_arn" {
  value = "${aws_sns_topic.sns.arn}"
}