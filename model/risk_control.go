package model

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
)

type IpAccountStat struct {
	Ip           string `json:"ip"`
	UserCount    int    `json:"user_count"`
	UserIdStr    string `json:"-" gorm:"column:user_ids"`
	UserNames    string `json:"user_names" gorm:"column:user_names"`
	RequestCount int    `json:"request_count"`
	TotalQuota   int    `json:"total_quota"`
	LastSeen     int64  `json:"last_seen"`
}

type AbnormalUserStat struct {
	UserId       int     `json:"user_id"`
	Username     string  `json:"username"`
	IpCount      int     `json:"ip_count"`
	RequestCount int     `json:"request_count"`
	TotalQuota   int     `json:"total_quota"`
	TotalTokens  int     `json:"total_tokens"`
	AvgUseTime   float64 `json:"avg_use_time"`
	FirstSeen    int64   `json:"first_seen"`
	LastSeen     int64   `json:"last_seen"`
}

type RiskControlStats struct {
	TotalUsers    int `json:"total_users"`
	ActiveUsers   int `json:"active_users"`
	MultiIpUsers  int `json:"multi_ip_users"`
	BurstUsers    int `json:"burst_users"`
	SuspiciousIps int `json:"suspicious_ips"`
	TotalRequests int `json:"total_requests"`
}

func GetRiskControlWhitelistUserIds() []int {
	return common.RiskControlWhitelistUserIds
}

func GetRiskControlWhitelistUsers() ([]map[string]interface{}, error) {
	userIds := GetRiskControlWhitelistUserIds()
	if len(userIds) == 0 {
		return []map[string]interface{}{}, nil
	}
	var users []User
	if err := DB.Where("id IN ?", userIds).Find(&users).Error; err != nil {
		return nil, err
	}
	result := make([]map[string]interface{}, 0, len(users))
	for _, u := range users {
		result = append(result, map[string]interface{}{
			"user_id":  u.Id,
			"username": u.Username,
		})
	}
	return result, nil
}

func AddRiskControlWhitelistUser(userId int) error {
	if userId <= 0 {
		return errors.New("invalid user id")
	}
	userIds := GetRiskControlWhitelistUserIds()
	for _, id := range userIds {
		if id == userId {
			return errors.New("user already in whitelist")
		}
	}
	userIds = append(userIds, userId)
	return updateRiskControlWhitelist(userIds)
}

func RemoveRiskControlWhitelistUser(userId int) error {
	userIds := GetRiskControlWhitelistUserIds()
	newUserIds := make([]int, 0, len(userIds))
	found := false
	for _, id := range userIds {
		if id == userId {
			found = true
			continue
		}
		newUserIds = append(newUserIds, id)
	}
	if !found {
		return errors.New("user not in whitelist")
	}
	return updateRiskControlWhitelist(newUserIds)
}

func updateRiskControlWhitelist(userIds []int) error {
	strIds := make([]string, len(userIds))
	for i, id := range userIds {
		strIds[i] = strconv.Itoa(id)
	}
	value := strings.Join(strIds, ",")
	return UpdateOption("RiskControlWhitelist", value)
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

	whitelistIds := GetRiskControlWhitelistUserIds()

	countQuery := LOG_DB.Table("logs").
		Select("ip").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("ip").
		Having("COUNT(DISTINCT user_id) >= ?", minAccounts)

	if len(whitelistIds) > 0 {
		countQuery = countQuery.Where("user_id NOT IN ?", whitelistIds)
	}

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

	if len(whitelistIds) > 0 {
		dataQuery = dataQuery.Where("user_id NOT IN ?", whitelistIds)
	}

	if err := dataQuery.Find(&results).Error; err != nil {
		return nil, 0, errors.New("failed to query multi-account IPs")
	}

	if len(results) > 0 {
		ips := make([]string, len(results))
		for i, r := range results {
			ips[i] = r.Ip
		}

		type ipUser struct {
			Ip       string `gorm:"column:ip"`
			Username string `gorm:"column:username"`
		}
		var ipUsers []ipUser

		userQuery := LOG_DB.Table("logs").
			Select("ip, username").
			Where("type = ?", LogTypeConsume).
			Where("ip IN ?", ips).
			Where("ip != ''").
			Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
			Where("username != ''").
			Group("ip, username")

		if len(whitelistIds) > 0 {
			userQuery = userQuery.Where("user_id NOT IN ?", whitelistIds)
		}

		if err := userQuery.Find(&ipUsers).Error; err == nil {
			ipUserMap := make(map[string][]string)
			for _, iu := range ipUsers {
				ipUserMap[iu.Ip] = append(ipUserMap[iu.Ip], iu.Username)
			}
			for i := range results {
				if names, ok := ipUserMap[results[i].Ip]; ok {
					results[i].UserNames = strings.Join(names, ",")
				}
			}
		}
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

	whitelistIds := GetRiskControlWhitelistUserIds()
	if len(whitelistIds) > 0 {
		query = query.Where("user_id NOT IN ?", whitelistIds)
	}

	if err := query.Find(&results).Error; err != nil {
		return nil, errors.New("failed to query IP users")
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

	whitelistIds := GetRiskControlWhitelistUserIds()

	countQuery := LOG_DB.Table("logs").
		Select("user_id").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id").
		Having("COUNT(*) >= ?", threshold)

	if len(whitelistIds) > 0 {
		countQuery = countQuery.Where("user_id NOT IN ?", whitelistIds)
	}

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

	if len(whitelistIds) > 0 {
		dataQuery = dataQuery.Where("user_id NOT IN ?", whitelistIds)
	}

	if err := dataQuery.Find(&results).Error; err != nil {
		return nil, 0, errors.New("failed to query abnormal users")
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

	whitelistIds := GetRiskControlWhitelistUserIds()

	var totalUserCount int64
	DB.Model(&User{}).Count(&totalUserCount)
	stats.TotalUsers = int(totalUserCount)

	var activeUserCount int64
	activeQuery := LOG_DB.Model(&Log{}).
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Distinct("user_id")
	if len(whitelistIds) > 0 {
		activeQuery = activeQuery.Where("user_id NOT IN ?", whitelistIds)
	}
	activeQuery.Count(&activeUserCount)
	stats.ActiveUsers = int(activeUserCount)

	var multiIpCount int64
	multiIpQuery := LOG_DB.Table("logs").
		Select("user_id").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id").
		Having("COUNT(DISTINCT ip) >= 3")
	if len(whitelistIds) > 0 {
		multiIpQuery = multiIpQuery.Where("user_id NOT IN ?", whitelistIds)
	}
	if err := multiIpQuery.Count(&multiIpCount).Error; err != nil {
		common.SysError("failed to count multi-ip users: " + err.Error())
	}
	stats.MultiIpUsers = int(multiIpCount)

	var burstUserCount int64
	burstHourExpr := getHourBucketExpr()
	burstSubQuery := LOG_DB.Table("logs").
		Select("user_id, "+burstHourExpr+" as hour_bucket, COUNT(*) as cnt").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id, "+burstHourExpr).
		Having("COUNT(*) >= ?", 50)
	if len(whitelistIds) > 0 {
		burstSubQuery = burstSubQuery.Where("user_id NOT IN ?", whitelistIds)
	}
	burstQuery := LOG_DB.Table("(?) as burst", burstSubQuery).
		Select("COUNT(DISTINCT user_id)")
	if err := burstQuery.Count(&burstUserCount).Error; err != nil {
		common.SysError("failed to count burst users: " + err.Error())
	}
	stats.BurstUsers = int(burstUserCount)

	var suspiciousIpCount int64
	suspiciousIpQuery := LOG_DB.Table("logs").
		Select("ip").
		Where("type = ?", LogTypeConsume).
		Where("ip != ''").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("ip").
		Having("COUNT(DISTINCT user_id) >= 3")
	if len(whitelistIds) > 0 {
		suspiciousIpQuery = suspiciousIpQuery.Where("user_id NOT IN ?", whitelistIds)
	}
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

	return stats, nil
}

func getHourBucketExpr() string {
	if common.UsingMySQL {
		return "FLOOR(created_at / 3600)"
	}
	return "created_at / 3600"
}

func GetBurstUsers(startTimestamp int64, endTimestamp int64, burstThreshold int, startIdx int, pageSize int) ([]AbnormalUserStat, int64, error) {
	if burstThreshold <= 0 {
		burstThreshold = 50
	}

	if startTimestamp == 0 {
		startTimestamp = time.Now().AddDate(0, 0, -7).Unix()
	}
	if endTimestamp == 0 {
		endTimestamp = time.Now().Unix()
	}

	whitelistIds := GetRiskControlWhitelistUserIds()
	hourExpr := getHourBucketExpr()

	burstSubQuery := LOG_DB.Table("logs").
		Select("user_id, "+hourExpr+" as hour_bucket, COUNT(*) as cnt").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Group("user_id, "+hourExpr).
		Having("COUNT(*) >= ?", burstThreshold)
	if len(whitelistIds) > 0 {
		burstSubQuery = burstSubQuery.Where("user_id NOT IN ?", whitelistIds)
	}

	var total int64
	countQuery := LOG_DB.Table("(?) as burst", burstSubQuery).
		Select("COUNT(DISTINCT user_id)")
	if err := countQuery.Count(&total).Error; err != nil {
		return nil, 0, errors.New("failed to count burst users")
	}

	burstUserIdsQuery := LOG_DB.Table("(?) as burst", burstSubQuery).
		Select("DISTINCT user_id")

	dataQuery := LOG_DB.Table("logs").
		Select("user_id, username, COUNT(DISTINCT ip) as ip_count, COUNT(*) as request_count, SUM(quota) as total_quota, SUM(prompt_tokens) + SUM(completion_tokens) as total_tokens, AVG(use_time) as avg_use_time, MIN(created_at) as first_seen, MAX(created_at) as last_seen").
		Where("type = ?", LogTypeConsume).
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Where("user_id IN (?)", burstUserIdsQuery).
		Group("user_id, username").
		Order("request_count DESC").
		Offset(startIdx).Limit(pageSize)

	var results []AbnormalUserStat
	if err := dataQuery.Find(&results).Error; err != nil {
		return nil, 0, errors.New("failed to query burst users")
	}

	return results, total, nil
}
