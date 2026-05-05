package model

import (
	"github.com/QuantumNous/new-api/common"
)

type ErrorMapping struct {
	ID         int    `json:"id" gorm:"primaryKey"`
	Code       string `json:"code" gorm:"uniqueIndex;size:20"`
	Message    string `json:"message" gorm:"type:text"`
	StatusCode int    `json:"status_code"`
	ErrorType  string `json:"error_type" gorm:"size:50"`
	ChannelId  int    `json:"channel_id"`
	ModelName  string `json:"model_name" gorm:"index;size:128"`
	TokenName  string `json:"token_name" gorm:"size:128"`
	Username   string `json:"username" gorm:"index;size:128"`
	UserId     int    `json:"user_id"`
	CreatedAt  int64  `json:"created_at" gorm:"bigint;index"`
}

func CreateErrorMapping(mapping *ErrorMapping) error {
	return DB.Create(mapping).Error
}

func GetErrorMappingByCode(code string) (*ErrorMapping, error) {
	var mapping ErrorMapping
	err := DB.Where("code = ?", code).First(&mapping).Error
	if err != nil {
		return nil, err
	}
	return &mapping, nil
}

func GetErrorMappings(page int, pageSize int, username string) ([]ErrorMapping, int64, error) {
	var mappings []ErrorMapping
	var total int64
	query := DB.Model(&ErrorMapping{})
	if username != "" {
		query = query.Where("username = ?", username)
	}
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * pageSize
	err = query.Order("created_at desc").Limit(pageSize).Offset(offset).Find(&mappings).Error
	return mappings, total, err
}

func CleanupOldErrorMappings(days int) error {
	cutoff := common.GetTimestamp() - int64(days*86400)
	return DB.Where("created_at < ?", cutoff).Delete(&ErrorMapping{}).Error
}
