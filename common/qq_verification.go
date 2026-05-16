package common

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

type QQVerificationToken struct {
	Token     string
	UserId    int
	QQNumber  string
	CreatedAt time.Time
}

var qqVerificationMutex sync.Mutex
var qqVerificationMap map[string]*QQVerificationToken
var QQVerificationValidMinutes = 5

func GenerateQQVerificationToken(userId int, qqNumber string) string {
	qqVerificationMutex.Lock()
	defer qqVerificationMutex.Unlock()

	token := "qm-" + uuid.New().String()[:8]

	qqVerificationMap[token] = &QQVerificationToken{
		Token:     token,
		UserId:    userId,
		QQNumber:  qqNumber,
		CreatedAt: time.Now(),
	}

	for key, value := range qqVerificationMap {
		if value.UserId == userId && key != token {
			delete(qqVerificationMap, key)
		}
	}

	cleanupExpiredQQTokens()

	return token
}

func VerifyQQToken(token string, qqNumber string) (int, error) {
	qqVerificationMutex.Lock()
	defer qqVerificationMutex.Unlock()

	value, ok := qqVerificationMap[token]
	if !ok {
		return 0, fmt.Errorf("token not found")
	}

	if int(time.Since(value.CreatedAt).Seconds()) >= QQVerificationValidMinutes*60 {
		delete(qqVerificationMap, token)
		return 0, fmt.Errorf("token expired")
	}

	if value.QQNumber != qqNumber {
		return 0, fmt.Errorf("qq number mismatch")
	}

	userId := value.UserId
	delete(qqVerificationMap, token)

	return userId, nil
}

func GetQQTokenInfo(token string) *QQVerificationToken {
	qqVerificationMutex.Lock()
	defer qqVerificationMutex.Unlock()

	value, ok := qqVerificationMap[token]
	if !ok {
		return nil
	}

	return value
}

func DeleteQQToken(token string) {
	qqVerificationMutex.Lock()
	defer qqVerificationMutex.Unlock()

	delete(qqVerificationMap, token)
}

func cleanupExpiredQQTokens() {
	now := time.Now()
	for key, value := range qqVerificationMap {
		if int(now.Sub(value.CreatedAt).Seconds()) >= QQVerificationValidMinutes*60 {
			delete(qqVerificationMap, key)
		}
	}
}

func init() {
	qqVerificationMutex.Lock()
	defer qqVerificationMutex.Unlock()
	qqVerificationMap = make(map[string]*QQVerificationToken)
}
