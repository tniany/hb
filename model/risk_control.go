package model

import (
	"errors"
	"time"

	"github.com/QuantumNous/new-api/common"
)

type IpAccountStat struct {
	Ip          string `json:"ip"`
	UserCount   int    `json:"user_count"`
	UserIdStr   string `json:"-" gorm:"column:user_ids"`
	RequestCount int   `json:"request_count"`
	TotalQuota  int    `json:"total_quota"`
	LastSeen    int64  `json:"last_seen"`
}

type AbnormalUserStat struct {
	UserId        int     `json:"user_id"`
	Username      string  `json:"username"`
	IpCount       int     `json:"ip_count"`
	RequestCount  int     `json:"request_count"`
	TotalQuota    int     `json:"total_quota"`
	TotalTokens   int     `json:"total_tokens"`
	AvgUseTime    float64 `json:"avg_use_time"`
	ErrorCount    int     `json:"error_count"`
	FirstSeen     int64   `json:"first_seen"`
	LastSeen      int64   `json:"last_seen"`
}

type RiskControlStats struct {
	TotalUsers          int `json:"total_users"`
	ActiveUsers         int `json:"active_users"`
	MultiIpUsers        int `json:"multi_ip_users"`
	HighQuotaUsers      int `json:"high_quota_users"`
	SuspiciousIps       int `json:"suspicious_ips"`
	TotalRequests       int `json:"total_requests"`
	ErrorRequests       int `json:"error_requests"`
}

func GetMultiAccountIps(startTimestamp int64, endTimestamp int64, minAccounts int, startIdx int, pageSize int) ([]IpAccountStat, int64, error) {
	if minAccounts < 2 {
		minAccounts = 2
	}

	if startTimestamp == 0 {
		startTimestamp = time.Now().AddDate(0, 0, -7).Unix()
	}
	if endTimestamp == 0 {
		endTimestamp = time.Now().Unix()
	}

	var total int64
	var results []IpAccountStat

	countQuery := LOG_DB.Table("logs").
		Select("ip").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("ip").
		Having("COUNT(DISTINCT user_id) >= ?", minAccounts)

	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, errors.New("failed to count multi-account IPs")
	}

	dataQuery := LOG_DB.Table("logs").
		Select("ip, COUNT(DISTINCT user_id) as user_count, COUNT(*) as request_count, SUM(quota) as total_quota, MAX(created_at) as last_seen").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("ip").
		Having("COUNT(DISTINCT user_id) >= ?", minAccounts).
		Order("user_count DESC, request_count DESC").
		Offset(startIdx).Limit(pageSize)

	if err := dataQuery.Find(&results).Error; err != nil {
		return nil, 0, errors.New("failed to query multi-account IPs")
	}

	return results, total, nil
}

func GetIpUsers(ip string, startTimestamp int64, endTimestamp int64) ([]AbnormalUserStat, error) {
	if startTimestamp == 0 {
		startTimestamp = time.Now().AddDate(0, 0, -7).Unix()
	}
	if endTimestamp == 0 {
		endTimestamp = time.Now().Unix()
	}

	var results []AbnormalUserStat
	query := LOG_DB.Table("logs").
		Select("user_id, username, COUNT(DISTINCT ip) as ip_count, COUNT(*) as request_count, SUM(quota) as total_quota, SUM(prompt_tokens) + SUM(completion_tokens) as total_tokens, AVG(use_time) as avg_use_time, MIN(created_at) as first_seen, MAX(created_at) as last_seen").
		Where("type = ?", LogTypeConsume).
		Where("ip = ?", ip).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id, username").
		Order("request_count DESC")

	if err := query.Find(&results).Error; err != nil {
		return nil, errors.New("failed to query IP users")
	}

	errorQuery := LOG_DB.Table("logs").
		Select("user_id, COUNT(*) as cnt").
		Where("type = ?", LogTypeError).
		Where("ip = ?", ip).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id")

	type errorStat struct {
		UserId int `gorm:"column:user_id"`
		Cnt    int `gorm:"column:cnt"`
	}
	var errorStats []errorStat
	if err := errorQuery.Find(&errorStats).Error; err == nil {
		errorMap := make(map[int]int)
		for _, es := range errorStats {
			errorMap[es.UserId] = es.Cnt
		}
		for i := range results {
			results[i].ErrorCount = errorMap[results[i].UserId]
		}
	}

	return results, nil
}

func GetAbnormalUsers(startTimestamp int64, endTimestamp int64, threshold int, startIdx int, pageSize int) ([]AbnormalUserStat, int64, error) {
	if threshold <= 0 {
		threshold = 100
	}

	if startTimestamp == 0 {
		startTimestamp = time.Now().AddDate(0, 0, -7).Unix()
	}
	if endTimestamp == 0 {
		endTimestamp = time.Now().Unix()
	}

	var total int64
	var results []AbnormalUserStat

	countQuery := LOG_DB.Table("logs").
		Select("user_id").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id").
		Having("COUNT(*) >= ?", threshold)

	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, errors.New("failed to count abnormal users")
	}

	dataQuery := LOG_DB.Table("logs").
		Select("user_id, username, COUNT(DISTINCT ip) as ip_count, COUNT(*) as request_count, SUM(quota) as total_quota, SUM(prompt_tokens) + SUM(completion_tokens) as total_tokens, AVG(use_time) as avg_use_time, MIN(created_at) as first_seen, MAX(created_at) as last_seen").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id, username").
		Having("COUNT(*) >= ?", threshold).
		Order("request_count DESC").
		Offset(startIdx).Limit(pageSize)

	if err := dataQuery.Find(&results).Error; err != nil {
		return nil, 0, errors.New("failed to query abnormal users")
	}

	userIds := make([]int, 0, len(results))
	for _, r := range results {
		userIds = append(userIds, r.UserId)
	}

	if len(userIds) > 0 {
		type errorStat struct {
			UserId int `gorm:"column:user_id"`
			Cnt    int `gorm:"column:cnt"`
		}
		var errorStats []errorStat
		errorQuery := LOG_DB.Table("logs").
			Select("user_id, COUNT(*) as cnt").
			Where("type = ?", LogTypeError).
			Where("user_id IN ?", userIds).
			Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
			Group("user_id")

		if err := errorQuery.Find(&errorStats).Error; err == nil {
			errorMap := make(map[int]int)
			for _, es := range errorStats {
				errorMap[es.UserId] = es.Cnt
			}
			for i := range results {
				results[i].ErrorCount = errorMap[results[i].UserId]
			}
		}
	}

	return results, total, nil
}

func GetRiskControlStats(startTimestamp int64, endTimestamp int64) (*RiskControlStats, error) {
	if startTimestamp == 0 {
		startTimestamp = time.Now().AddDate(0, 0, -1).Unix()
	}
	if endTimestamp == 0 {
		endTimestamp = time.Now().Unix()
	}

	stats := &RiskControlStats{}

	var totalUserCount int64
	DB.Model(&User{}).Count(&totalUserCount)
	stats.TotalUsers = int(totalUserCount)

	var activeUserCount int64
	LOG_DB.Model(&Log{}).
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Distinct("user_id").
		Count(&activeUserCount)
	stats.ActiveUsers = int(activeUserCount)

	var multiIpCount int64
	multiIpQuery := LOG_DB.Table("logs").
		Select("user_id").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id").
		Having("COUNT(DISTINCT ip) >= 3")
	if err := multiIpQuery.Count(&multiIpCount).Error; err != nil {
		common.SysError("failed to count multi-ip users: " + err.Error())
	}
	stats.MultiIpUsers = int(multiIpCount)

	var highQuotaCount int64
	highQuotaQuery := LOG_DB.Table("logs").
		Select("user_id").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id").
		Having("SUM(quota) >= ?", 1000000)
	if err := highQuotaQuery.Count(&highQuotaCount).Error; err != nil {
		common.SysError("failed to count high quota users: " + err.Error())
	}
	stats.HighQuotaUsers = int(highQuotaCount)

	var suspiciousIpCount int64
	suspiciousIpQuery := LOG_DB.Table("logs").
		Select("ip").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("ip").
		Having("COUNT(DISTINCT user_id) >= 3")
	if err := suspiciousIpQuery.Count(&suspiciousIpCount).Error; err != nil {
		common.SysError("failed to count suspicious ips: " + err.Error())
	}
	stats.SuspiciousIps = int(suspiciousIpCount)

	var totalRequestCount int64
	LOG_DB.Model(&Log{}).
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Count(&totalRequestCount)
	stats.TotalRequests = int(totalRequestCount)

	var errorRequestCount int64
	LOG_DB.Model(&Log{}).
		Where("type = ?", LogTypeError).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Count(&errorRequestCount)
	stats.ErrorRequests = int(errorRequestCount)

	return stats, nil
}
