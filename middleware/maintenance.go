package middleware

import (
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/types"
	"github.com/gin-gonic/gin"
)

func MaintenanceCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !common.MaintenanceModeEnabled {
			c.Next()
			return
		}
		message := common.MaintenanceModeMessage
		if message == "" {
			message = "涵冰api-正在维护"
		}
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/v1/messages") {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"type": "error",
				"error": types.ClaudeError{
					Type:    "service_unavailable",
					Message: message,
				},
			})
		} else {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"error": types.OpenAIError{
					Message: message,
					Type:    "service_unavailable",
					Code:    "maintenance_mode",
				},
			})
		}
		c.Abort()
	}
}
