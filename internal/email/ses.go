package email

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/resendlabs/resend-go"
)

func SendVerificationEmail(to string) (string, error) {
	// Generate a 6-digit code
	rand.Seed(time.Now().UnixNano())
	code := fmt.Sprintf("%06d", rand.Intn(1000000))
	api_key := os.Getenv("RESEND_API_KEY")
	client := resend.NewClient(api_key)

	subject := "Your BilkentForum Verification Code"
	htmlContent := fmt.Sprintf("<p>Your verification code is <strong>%s</strong></p>", code)

	params := &resend.SendEmailRequest{
		From:    "noreply@bilkentforum.com",
		To:      []string{to},
		Subject: subject,
		Html:    htmlContent,
	}

	response, err := client.Emails.Send(params)
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		return "", err
	}

	log.Printf("Email sent successfully: %v", response.Id)
	return code, nil
}
