package email

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ses"
)

// SendEmailSES -> AWS SES üzerinden e-posta gönderir
func SendEmailSES(region, from, to, subject, body string) error {
	// AWS config yükle
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		return fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := ses.NewFromConfig(cfg)

	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []string{to},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Text: &ses.Content{
					Data: aws.String(body),
				},
			},
			Subject: &ses.Content{
				Data: aws.String(subject),
			},
		},
		Source: aws.String(from), // verified domain/email olmalı
	}

	_, err = client.SendEmail(context.TODO(), input)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("📨 Email sent to %s", to)
	return nil
}
