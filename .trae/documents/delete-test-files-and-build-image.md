# 删除测试文件并构建新版本镜像

## 目标
删除 GitHub 仓库中的 Go 测试文件（`*_test.go`），更新版本号，并推送代码触发新镜像构建。

## 步骤

### 1. 删除所有 `*_test.go` 文件（共36个）

**controller/ 目录（6个）：**
- `controller/topup_waffo_pancake_test.go`
- `controller/token_test.go`
- `controller/payment_webhook_availability_test.go`
- `controller/model_list_test.go`
- `controller/channel_upstream_update_test.go`
- `controller/channel_test_internal_test.go`

**common/ 目录（2个）：**
- `common/url_validator_test.go`
- `common/json_test.go`

**dto/ 目录（3个）：**
- `dto/openai_request_zero_value_test.go`
- `dto/gemini_isstream_test.go`
- `dto/gemini_generation_config_test.go`

**model/ 目录（2个）：**
- `model/task_cas_test.go`
- `model/payment_method_guard_test.go`

**service/ 目录（7个）：**
- `service/waffo_pancake_test.go`
- `service/tiered_settle_test.go`
- `service/text_quota_test.go`
- `service/task_billing_test.go`
- `service/error_test.go`
- `service/channel_affinity_usage_cache_test.go`
- `service/channel_affinity_template_test.go`

**relay/ 目录（12个）：**
- `relay/helper/stream_scanner_test.go`
- `relay/helper/price_test.go`
- `relay/helper/billing_expr_request_test.go`
- `relay/common/stream_status_test.go`
- `relay/common/relay_info_test.go`
- `relay/common/override_test.go`
- `relay/channel/gemini/relay_gemini_usage_test.go`
- `relay/channel/claude/relay_claude_test.go`
- `relay/channel/claude/message_delta_usage_patch_test.go`
- `relay/channel/aws/relay_aws_test.go`
- `relay/channel/api_request_test.go`
- `relay/channel/minimax/adaptor_test.go`

**setting/ 目录（3个）：**
- `setting/operation_setting/status_code_ranges_test.go`
- `setting/model_setting/claude_test.go`
- `setting/config/config_test.go`

**pkg/ 目录（1个）：**
- `pkg/billingexpr/billingexpr_test.go`

> 注：`controller/channel-test.go` 和 `channel-test-dialog.tsx` **不是**测试文件，它们是渠道测试功能的业务代码，保留不动。

### 2. 更新 VERSION 文件
- 将 `VERSION` 从 `3.2.0` 改为 `3.2.2`

### 3. 提交并推送到 GitHub
- `git add -A`
- `git commit -m "chore: remove test files and bump version to v3.2.2"`
- `git tag v3.2.2`
- `git push origin main --tags`

### 4. 触发镜像构建
推送后，`build-image.yml` workflow 会在 main 分支 push 时自动触发，构建 `linux/amd64` 和 `linux/arm64` 多架构镜像，推送到 `ghcr.io`。

## 注意事项
- 删除测试文件后，`go build` 不受影响（测试文件不参与编译）
- Docker 构建中 `COPY . .` 会包含这些文件，但删除后镜像体积略微减小
- `pr-check.yml` 不运行测试，所以删除测试文件不会影响 PR 检查
