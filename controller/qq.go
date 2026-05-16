package controller

import (
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/i18n"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type QQBotVerifyRequest struct {
	Token      string `json:"token"`
	QQNumber   string `json:"qq_number"`
	QQNickname string `json:"qq_nickname"`
}

func QQBotVerifyToken(c *gin.Context) {
	if !common.QQGroupVerificationEnabled {
		common.ApiErrorI18n(c, i18n.MsgFeatureDisabled)
		return
	}

	var req QQBotVerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorI18n(c, i18n.MsgInvalidParams)
		return
	}

	if req.Token == "" || req.QQNumber == "" {
		common.ApiErrorI18n(c, i18n.MsgInvalidParams)
		return
	}

	userId, err := common.VerifyQQToken(req.Token, req.QQNumber)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	user := model.User{Id: userId}
	if err := user.FillUserById(); err != nil {
		common.ApiErrorI18n(c, i18n.MsgDatabaseError)
		return
	}

	if user.Id == 0 {
		common.ApiErrorI18n(c, i18n.MsgUserNotExists)
		return
	}

	user.QQId = req.QQNumber
	user.Status = common.UserStatusEnabled
	if req.QQNickname != "" {
		user.DisplayName = req.QQNickname
	}
	if err := user.Update(false); err != nil {
		common.ApiErrorI18n(c, i18n.MsgDatabaseError)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "QQ binding completed successfully",
		"data": gin.H{
			"user_id":      userId,
			"qq_number":    req.QQNumber,
			"display_name": user.DisplayName,
		},
	})
}

func QQBotQueryToken(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		common.ApiErrorI18n(c, i18n.MsgInvalidParams)
		return
	}

	tokenInfo := common.GetQQTokenInfo(token)
	if tokenInfo != nil {
		user := model.User{Id: tokenInfo.UserId}
		if err := user.FillUserById(); err == nil && user.QQId != "" {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"message": "",
				"data": gin.H{
					"status":    "completed",
					"user_id":   tokenInfo.UserId,
					"qq_number": tokenInfo.QQNumber,
				},
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "",
			"data": gin.H{
				"status":    "pending",
				"user_id":   tokenInfo.UserId,
				"qq_number": tokenInfo.QQNumber,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"status": "completed",
		},
	})
}

func GetUserQQToken(c *gin.Context) {
	if !common.QQGroupVerificationEnabled {
		common.ApiErrorI18n(c, i18n.MsgFeatureDisabled)
		return
	}

	session := sessions.Default(c)
	id := session.Get("id")
	if id == nil {
		common.ApiErrorI18n(c, i18n.MsgAuthNotLoggedIn)
		return
	}

	user := model.User{Id: id.(int)}
	if err := user.FillUserById(); err != nil {
		common.ApiErrorI18n(c, i18n.MsgDatabaseError)
		return
	}

	if user.Id == 0 {
		common.ApiErrorI18n(c, i18n.MsgUserNotExists)
		return
	}

	qqNumber := ""
	if user.Email != "" && strings.HasSuffix(user.Email, "@qq.com") {
		qqNumber = strings.TrimSuffix(user.Email, "@qq.com")
	}

	if qqNumber == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "unable to extract QQ number from email",
		})
		return
	}

	token := common.GenerateQQVerificationToken(user.Id, qqNumber)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": gin.H{
			"token": token,
		},
	})
}
