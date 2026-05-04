/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { API, showError, showSuccess, timestamp2string } from '../../../helpers';
import { renderQuota } from '../../../helpers/render';

const { Text } = Typography;

const QUICK_RANGES = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

export default function SettingsRiskControl() {
  const { t } = useTranslation();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [multiAccountData, setMultiAccountData] = useState([]);
  const [multiAccountTotal, setMultiAccountTotal] = useState(0);
  const [multiAccountPage, setMultiAccountPage] = useState(1);
  const [multiAccountPageSize, setMultiAccountPageSize] = useState(10);
  const [minAccounts, setMinAccounts] = useState(2);
  const [multiAccountLoading, setMultiAccountLoading] = useState(false);

  const [abnormalData, setAbnormalData] = useState([]);
  const [abnormalTotal, setAbnormalTotal] = useState(0);
  const [abnormalPage, setAbnormalPage] = useState(1);
  const [abnormalPageSize, setAbnormalPageSize] = useState(10);
  const [threshold, setThreshold] = useState(100);
  const [abnormalLoading, setAbnormalLoading] = useState(false);

  const [ipUsersData, setIpUsersData] = useState([]);
  const [ipUsersLoading, setIpUsersLoading] = useState(false);
  const [ipUsersModalVisible, setIpUsersModalVisible] = useState(false);
  const [selectedIp, setSelectedIp] = useState('');

  const [rangeDays, setRangeDays] = useState(7);

  const [whitelist, setWhitelist] = useState([]);
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [addUserId, setAddUserId] = useState('');

  const getTimestamps = useCallback(() => {
    const endTimestamp = dayjs().unix();
    const startTimestamp = dayjs().subtract(rangeDays, 'day').unix();
    return { startTimestamp, endTimestamp };
  }, [rangeDays]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { startTimestamp, endTimestamp } = getTimestamps();
      const res = await API.get('/api/risk_control/stats', {
        params: { start_timestamp: startTimestamp, end_timestamp: endTimestamp },
      });
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    } finally {
      setStatsLoading(false);
    }
  }, [getTimestamps]);

  const fetchMultiAccountIps = useCallback(async () => {
    setMultiAccountLoading(true);
    try {
      const { startTimestamp, endTimestamp } = getTimestamps();
      const res = await API.get('/api/risk_control/multi_account_ips', {
        params: {
          p: multiAccountPage,
          page_size: multiAccountPageSize,
          start_timestamp: startTimestamp,
          end_timestamp: endTimestamp,
          min_accounts: minAccounts,
        },
      });
      if (res.data.success) {
        const data = res.data.data;
        setMultiAccountData(data.items || []);
        setMultiAccountTotal(data.total || 0);
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    } finally {
      setMultiAccountLoading(false);
    }
  }, [getTimestamps, multiAccountPage, multiAccountPageSize, minAccounts]);

  const fetchAbnormalUsers = useCallback(async () => {
    setAbnormalLoading(true);
    try {
      const { startTimestamp, endTimestamp } = getTimestamps();
      const res = await API.get('/api/risk_control/abnormal_users', {
        params: {
          p: abnormalPage,
          page_size: abnormalPageSize,
          start_timestamp: startTimestamp,
          end_timestamp: endTimestamp,
          threshold,
        },
      });
      if (res.data.success) {
        const data = res.data.data;
        setAbnormalData(data.items || []);
        setAbnormalTotal(data.total || 0);
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    } finally {
      setAbnormalLoading(false);
    }
  }, [getTimestamps, abnormalPage, abnormalPageSize, threshold]);

  const fetchIpUsers = async (ip) => {
    setIpUsersLoading(true);
    setSelectedIp(ip);
    setIpUsersModalVisible(true);
    try {
      const { startTimestamp, endTimestamp } = getTimestamps();
      const res = await API.get('/api/risk_control/ip_users', {
        params: { ip, start_timestamp: startTimestamp, end_timestamp: endTimestamp },
      });
      if (res.data.success) {
        setIpUsersData(res.data.data || []);
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    } finally {
      setIpUsersLoading(false);
    }
  };

  const banUser = async (userId, username) => {
    Modal.confirm({
      title: t('确认封禁用户'),
      content: `${t('确定要封禁用户')} ${username || userId}？${t('该用户将被禁用，无法访问系统。')}`,
      okText: t('确认封禁'),
      cancelText: t('取消'),
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await API.post('/api/risk_control/ban_user', null, {
            params: { user_id: userId },
          });
          if (res.data.success) {
            showSuccess(t('用户已封禁'));
            fetchAbnormalUsers();
          } else {
            showError(res.data.message);
          }
        } catch (e) {
          showError(e.message);
        }
      },
    });
  };

  const fetchWhitelist = useCallback(async () => {
    setWhitelistLoading(true);
    try {
      const res = await API.get('/api/risk_control/whitelist');
      if (res.data.success) {
        setWhitelist(res.data.data || []);
      }
    } catch (e) {
      showError(e.message);
    } finally {
      setWhitelistLoading(false);
    }
  }, []);

  const addWhitelistUser = async () => {
    const userId = parseInt(addUserId);
    if (!userId || userId <= 0) {
      showError(t('请输入有效的用户ID'));
      return;
    }
    try {
      const res = await API.post('/api/risk_control/whitelist/add', null, {
        params: { user_id: userId },
      });
      if (res.data.success) {
        showSuccess(t('已添加到白名单'));
        setAddUserId('');
        fetchWhitelist();
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    }
  };

  const removeWhitelistUser = async (userId) => {
    try {
      const res = await API.post('/api/risk_control/whitelist/remove', null, {
        params: { user_id: userId },
      });
      if (res.data.success) {
        showSuccess(t('已从白名单移除'));
        fetchWhitelist();
      } else {
        showError(res.data.message);
      }
    } catch (e) {
      showError(e.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchMultiAccountIps();
  }, [fetchMultiAccountIps]);

  useEffect(() => {
    fetchAbnormalUsers();
  }, [fetchAbnormalUsers]);

  useEffect(() => {
    fetchWhitelist();
  }, [fetchWhitelist]);

  const multiAccountColumns = [
    {
      title: t('IP 地址'),
      dataIndex: 'ip',
      key: 'ip',
      render: (text) => <Text copyable style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: t('关联用户'),
      dataIndex: 'user_names',
      key: 'user_names',
      render: (userNames) => {
        const names = (userNames || '').split(',').filter(Boolean);
        const visible = names.slice(0, 3);
        const hidden = names.length - 3;
        return (
          <Space wrap size={4}>
            {visible.map(name => (
              <Tag key={name} color='blue' size='small'>{name}</Tag>
            ))}
            {hidden > 0 && (
              <Tag color='grey' size='small'>+{hidden}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: t('请求数'),
      dataIndex: 'request_count',
      key: 'request_count',
      sorter: (a, b) => a.request_count - b.request_count,
      render: (count) => count?.toLocaleString(),
    },
    {
      title: t('消耗额度'),
      dataIndex: 'total_quota',
      key: 'total_quota',
      render: (quota) => renderQuota(quota),
    },
    {
      title: t('最后活动'),
      dataIndex: 'last_seen',
      key: 'last_seen',
      render: (ts) => timestamp2string(ts),
    },
    {
      title: t('操作'),
      key: 'action',
      render: (_, record) => (
        <Button size='small' type='tertiary' onClick={() => fetchIpUsers(record.ip)}>
          {t('查看关联用户')}
        </Button>
      ),
    },
  ];

  const abnormalColumns = [
    {
      title: t('用户ID'),
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: t('用户名'),
      dataIndex: 'username',
      key: 'username',
      render: (text) => text || '-',
    },
    {
      title: t('使用IP数'),
      dataIndex: 'ip_count',
      key: 'ip_count',
      sorter: (a, b) => a.ip_count - b.ip_count,
      render: (count) => (
        <Tag color={count >= 5 ? 'red' : count >= 3 ? 'orange' : 'blue'}>{count}</Tag>
      ),
    },
    {
      title: t('请求数'),
      dataIndex: 'request_count',
      key: 'request_count',
      sorter: (a, b) => a.request_count - b.request_count,
      render: (count) => count?.toLocaleString(),
    },
    {
      title: t('消耗额度'),
      dataIndex: 'total_quota',
      key: 'total_quota',
      render: (quota) => renderQuota(quota),
    },
    {
      title: t('Token数'),
      dataIndex: 'total_tokens',
      key: 'total_tokens',
      render: (tokens) => tokens?.toLocaleString(),
    },
    {
      title: t('平均耗时'),
      dataIndex: 'avg_use_time',
      key: 'avg_use_time',
      render: (time) => `${(time || 0).toFixed(2)}s`,
    },
    {
      title: t('首次活动'),
      dataIndex: 'first_seen',
      key: 'first_seen',
      render: (ts) => timestamp2string(ts),
    },
    {
      title: t('最后活动'),
      dataIndex: 'last_seen',
      key: 'last_seen',
      render: (ts) => timestamp2string(ts),
    },
    {
      title: t('操作'),
      key: 'action',
      render: (_, record) => (
        <Button
          size='small'
          type='danger'
          onClick={() => banUser(record.user_id, record.username)}
        >
          {t('封禁')}
        </Button>
      ),
    },
  ];

  const ipUsersColumns = [
    { title: t('用户ID'), dataIndex: 'user_id', key: 'user_id' },
    { title: t('用户名'), dataIndex: 'username', key: 'username', render: (text) => text || '-' },
    { title: t('请求数'), dataIndex: 'request_count', key: 'request_count', render: (count) => count?.toLocaleString() },
    { title: t('消耗额度'), dataIndex: 'total_quota', key: 'total_quota', render: (quota) => renderQuota(quota) },
    { title: t('Token数'), dataIndex: 'total_tokens', key: 'total_tokens', render: (tokens) => tokens?.toLocaleString() },
    { title: t('首次活动'), dataIndex: 'first_seen', key: 'first_seen', render: (ts) => timestamp2string(ts) },
    { title: t('最后活动'), dataIndex: 'last_seen', key: 'last_seen', render: (ts) => timestamp2string(ts) },
  ];

  const whitelistColumns = [
    { title: t('用户ID'), dataIndex: 'user_id', key: 'user_id' },
    { title: t('用户名'), dataIndex: 'username', key: 'username' },
    {
      title: t('操作'),
      key: 'action',
      render: (_, record) => (
        <Button size='small' type='danger' onClick={() => removeWhitelistUser(record.user_id)}>
          {t('移除')}
        </Button>
      ),
    },
  ];

  const renderStatCard = (label, value) => (
    <Card style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 'bold' }}>{value ?? '-'}</div>
    </Card>
  );

  return (
    <>
      <Spin spinning={statsLoading}>
        <Card
          title={t('风控管理')}
          headerExtraContent={
            <Space>
              {QUICK_RANGES.map((r) => (
                <Button
                  key={r.days}
                  size='small'
                  type={rangeDays === r.days ? 'primary' : 'tertiary'}
                  onClick={() => setRangeDays(r.days)}
                >
                  {t('最近')} {r.label}
                </Button>
              ))}
            </Space>
          }
        >
          <p style={{ color: '#666', marginBottom: 16 }}>
            {t('检测多账号用户、异常使用模式和潜在滥用行为')}
          </p>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={8} md={6} lg={4}>
              {renderStatCard(t('总用户数'), stats?.total_users)}
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              {renderStatCard(t('活跃用户'), stats?.active_users)}
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              {renderStatCard(t('总请求数'), stats?.total_requests?.toLocaleString())}
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              {renderStatCard(t('可疑IP'), stats?.suspicious_ips)}
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              {renderStatCard(t('多IP用户'), stats?.multi_ip_users)}
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              {renderStatCard(t('高额度用户'), stats?.high_quota_users)}
            </Col>
          </Row>
        </Card>
      </Spin>

      <Card
        title={t('同IP多账号检测')}
        style={{ marginTop: 16 }}
        headerExtraContent={
          <Space>
            <span>{t('最小账号数')}：</span>
            <Select
              value={minAccounts}
              onChange={(v) => {
                setMinAccounts(v);
                setMultiAccountPage(1);
              }}
              style={{ width: 80 }}
              optionList={[
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
                { label: '5', value: 5 },
                { label: '10', value: 10 },
              ]}
            />
          </Space>
        }
      >
        <Table
          loading={multiAccountLoading}
          columns={multiAccountColumns}
          dataSource={multiAccountData}
          rowKey='ip'
          pagination={{
            currentPage: multiAccountPage,
            pageSize: multiAccountPageSize,
            total: multiAccountTotal,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            onChange: (page, pageSize) => {
              setMultiAccountPage(page);
              setMultiAccountPageSize(pageSize);
            },
          }}
        />
      </Card>

      <Card
        title={t('异常用户检测')}
        style={{ marginTop: 16 }}
        headerExtraContent={
          <Space>
            <span>{t('请求阈值')}：</span>
            <Select
              value={threshold}
              onChange={(v) => {
                setThreshold(v);
                setAbnormalPage(1);
              }}
              style={{ width: 100 }}
              optionList={[
                { label: '50', value: 50 },
                { label: '100', value: 100 },
                { label: '200', value: 200 },
                { label: '500', value: 500 },
                { label: '1000', value: 1000 },
                { label: '5000', value: 5000 },
              ]}
            />
          </Space>
        }
      >
        <Table
          loading={abnormalLoading}
          columns={abnormalColumns}
          dataSource={abnormalData}
          rowKey='user_id'
          pagination={{
            currentPage: abnormalPage,
            pageSize: abnormalPageSize,
            total: abnormalTotal,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            onChange: (page, pageSize) => {
              setAbnormalPage(page);
              setAbnormalPageSize(pageSize);
            },
          }}
        />
      </Card>

      <Card
        title={t('风控白名单')}
        style={{ marginTop: 16 }}
        headerExtraContent={
          <Space>
            <Input
              placeholder={t('输入用户ID')}
              value={addUserId}
              onChange={(v) => setAddUserId(v)}
              style={{ width: 120 }}
              onPressEnter={addWhitelistUser}
            />
            <Button size='small' type='primary' onClick={addWhitelistUser}>
              {t('添加')}
            </Button>
          </Space>
        }
      >
        <p style={{ color: '#666', marginBottom: 16 }}>
          {t('白名单中的用户不会出现在风控检测列表中')}
        </p>
        <Table
          loading={whitelistLoading}
          columns={whitelistColumns}
          dataSource={whitelist}
          rowKey='user_id'
          pagination={false}
          size='small'
        />
      </Card>

      <Modal
        title={`${t('IP 关联用户详情')} - ${selectedIp}`}
        visible={ipUsersModalVisible}
        onCancel={() => setIpUsersModalVisible(false)}
        footer={null}
        width={900}
      >
        <Spin spinning={ipUsersLoading}>
          <Table
            columns={ipUsersColumns}
            dataSource={ipUsersData}
            rowKey='user_id'
            pagination={false}
            size='small'
          />
        </Spin>
      </Modal>
    </>
  );
}
