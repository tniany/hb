import { Fish, MessageSquare, Bot, Hash, Key, PenLine, CheckCircle } from 'lucide-react'
import { AppHeader, Main } from '@/components/layout'
import {
  CardStaggerContainer,
  CardStaggerItem,
} from '@/components/page-transition'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const STEPS = [
  {
    icon: MessageSquare,
    title: '加入交流群',
    description: '请先加入我们的交流群，1092522145，并阅读群公告',
  },
  {
    icon: Bot,
    title: '找到Bot机器人并私聊',
    description: '在群成员列表中找到Bot机器人账号，点击进入私聊窗口。',
  },
  {
    icon: PenLine,
    title: '发送绑定指令',
    description: '在私聊窗口中发送以下绑定指令：',
    code: '/绑定 你的id 你的系统令牌',
  },
  {
    icon: Hash,
    title: 'ID是什么？',
    description: 'ID是你在本站名字下方显示的纯数字编号，可在个人中心查看。',
  },
  {
    icon: Key,
    title: '系统令牌是什么？',
    description: '系统令牌需要在本站「个人中心 → 令牌管理」中点击「生成令牌」来获取。',
  },
  {
    icon: Fish,
    title: '签到方法',
    description: '绑定成功后，在群聊中发送以下指令即可完成每日签到领取鱼干：',
    code: '/签到',
  },
]

export function ClaimFishTutorial() {
  return (
    <>
      <AppHeader />
      <Main>
        <div className='min-h-0 flex-1 overflow-auto px-3 py-3 sm:px-4 sm:py-6'>
          <CardStaggerContainer className='mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6'>
            <CardStaggerItem>
              <Card className='gap-0 overflow-hidden py-0'>
                <CardHeader className='border-b p-3 !pb-3 sm:p-5 sm:!pb-5'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9'>
                      <Fish className='h-4 w-4 sm:h-5 sm:w-5' />
                    </div>
                    <div className='min-w-0'>
                      <CardTitle className='text-lg tracking-tight sm:text-xl'>
                        领取鱼干教程
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3 p-3 sm:space-y-4 sm:p-5'>
                  {STEPS.map((step, index) => (
                    <div
                      key={index}
                      className='bg-background/60 flex items-start gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4'
                    >
                      <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-8 sm:w-8'>
                        {index + 1}
                      </div>
                      <div className='min-w-0 flex-1 space-y-1.5'>
                        <div className='flex items-center gap-2'>
                          <step.icon className='text-muted-foreground h-4 w-4' />
                          <p className='text-sm font-semibold'>{step.title}</p>
                        </div>
                        <p className='text-muted-foreground text-xs sm:text-sm'>
                          {step.description}
                        </p>
                        {step.code && (
                          <div className='bg-muted/50 rounded-lg border px-3 py-2 font-mono text-xs sm:text-sm'>
                            {step.code}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardStaggerItem>

            <CardStaggerItem>
              <Card className='gap-0 overflow-hidden py-0'>
                <CardContent className='p-3 sm:p-5'>
                  <div className='bg-primary/5 flex items-start gap-3 rounded-xl border border-primary/20 p-3 sm:p-4'>
                    <CheckCircle className='text-primary mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5' />
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold'>绑定成功提示</p>
                      <p className='text-muted-foreground text-xs sm:text-sm'>
                        当Bot回复「绑定成功，欢迎您」时，表示绑定已完成。此后在群聊中发送
                        <span className='bg-muted/50 mx-1 rounded px-1.5 py-0.5 font-mono text-xs'>
                          /签到
                        </span>
                        即可每日领取鱼干奖励。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardStaggerItem>
          </CardStaggerContainer>
        </div>
      </Main>
    </>
  )
}
