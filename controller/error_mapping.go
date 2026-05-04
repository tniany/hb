package controller

import (
	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

func GetErrorMappings(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	mappings, total, err := model.GetErrorMappings(pageInfo.GetPage(), pageInfo.GetPageSize())
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
