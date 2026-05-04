package controller

import (
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

func GetRiskControlStats(c *gin.Context) {
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)

	stats, err := model.GetRiskControlStats(startTimestamp, endTimestamp)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, stats)
}

func GetMultiAccountIps(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	minAccounts, _ := strconv.Atoi(c.DefaultQuery("min_accounts", "2"))

	if minAccounts < 2 {
		minAccounts = 2
	}

	data, total, err := model.GetMultiAccountIps(startTimestamp, endTimestamp, minAccounts, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}

	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(data)
	common.ApiSuccess(c, pageInfo)
}

func GetIpUsers(c *gin.Context) {
	ip := c.Query("ip")
	if ip == "" {
		common.ApiErrorMsg(c, "ip is required")
		return
	}

	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)

	users, err := model.GetIpUsers(ip, startTimestamp, endTimestamp)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, users)
}

func GetAbnormalUsers(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	startTimestamp, _ := strconv.ParseInt(c.Query("start_timestamp"), 10, 64)
	endTimestamp, _ := strconv.ParseInt(c.Query("end_timestamp"), 10, 64)
	threshold, _ := strconv.Atoi(c.DefaultQuery("threshold", "100"))

	if threshold <= 0 {
		threshold = 100
	}

	data, total, err := model.GetAbnormalUsers(startTimestamp, endTimestamp, threshold, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}

	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(data)
	common.ApiSuccess(c, pageInfo)
}

func BannedUser(c *gin.Context) {
	userId, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}

	targetUser, err := model.GetUserById(userId, false)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	if targetUser.Role >= common.RoleAdminUser {
		common.ApiErrorMsg(c, "cannot ban admin users")
		return
	}

	targetUser.Status = common.UserStatusDisabled
	err = targetUser.Update(false)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, nil)
}
