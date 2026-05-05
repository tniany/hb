package controller

import (
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

func GetErrorMappings(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	username := c.Query("username")
	mappings, total, err := model.GetErrorMappings(pageInfo.GetPage(), pageInfo.GetPageSize(), username)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(mappings)
	common.ApiSuccess(c, pageInfo)
}

func GetErrorMappingByCode(c *gin.Context) {
	code := c.Param("code")
	if code == "" {
		common.ApiErrorMsg(c, "error code is required")
		return
	}
	mapping, err := model.GetErrorMappingByCode(code)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, mapping)
}

func GetErrorLogs(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	modelName := c.Query("model_name")
	channel, _ := strconv.Atoi(c.Query("channel_id"))
	username := c.Query("username")
	logs, total, err := model.GetAllLogs(model.LogTypeError, 0, 0, modelName, username, "", pageInfo.GetStartIdx(), pageInfo.GetPageSize(), channel, "", "")
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(logs)
	common.ApiSuccess(c, pageInfo)
}
