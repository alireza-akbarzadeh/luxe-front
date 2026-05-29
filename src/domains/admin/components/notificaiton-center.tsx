import {
  IconBell,
  IconCheck,
  IconExternalLink,
  IconMessage2,
  IconTrash} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import type {
  MessageItem as MessageItemType,
  NotificationItem as NotificationItemType} from '../admin.store';
import { useDashboardStore } from '../admin.store';

export function NotificationCenter() {
  const notifications = useDashboardStore((state) => state.notifications);
  const messages = useDashboardStore((state) => state.messages);
  const isOpen = useDashboardStore((state) => state.notificationOpen);
  const setNotificationOpen = useDashboardStore((state) => state.setNotificationOpen);
  const markAsRead = useDashboardStore((state) => state.markAsRead);
  const markAllRead = useDashboardStore((state) => state.markAllRead);
  const markMessageRead = useDashboardStore((state) => state.markMessageRead);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadMsgs = messages.filter((m) => m.unread).length;
  const totalUnread = unreadNotifs + unreadMsgs;

  return (
    <Popover open={isOpen} onOpenChange={setNotificationOpen}>
      <PopoverTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='from-primary to-secondary hover:bg-muted group relative h-12 w-12 rounded-full bg-linear-to-r'
        >
          <motion.div
            animate={totalUnread > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{
              repeat: totalUnread > 0 ? Infinity : 0,
              repeatDelay: 4,
              duration: 0.5
            }}
          >
            <IconBell
              className={cn(
                'h-5 w-5 transition-colors',
                totalUnread > 0 ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </motion.div>
          {totalUnread > 0 && (
            <span className='bg-primary ring-background absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full ring-2' />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className='border-border/50 bg-card/95 z-50 w-80 overflow-hidden rounded-2xl p-0 shadow-2xl backdrop-blur-xl sm:w-96'
      >
        <Tabs defaultValue='alerts' className='w-full'>
          <div className='bg-muted/30 flex items-center justify-between border-b p-4'>
            <TabsList className='bg-background/50 border-border/40 grid h-8 w-44 grid-cols-2 border'>
              <TabsTrigger
                value='alerts'
                className='text-[10px] font-bold tracking-tight uppercase'
              >
                Alerts {unreadNotifs > 0 && `(${unreadNotifs})`}
              </TabsTrigger>
              <TabsTrigger
                value='messages'
                className='text-[10px] font-bold tracking-tight uppercase'
              >
                Messages {unreadMsgs > 0 && `(${unreadMsgs})`}
              </TabsTrigger>
            </TabsList>
            <Button
              variant='ghost'
              size='sm'
              onClick={markAllRead}
              className='hover:text-primary h-8 px-2 text-[10px] font-bold tracking-tighter uppercase opacity-70 transition-all hover:opacity-100 active:scale-90'
            >
              Clear All
            </Button>
          </div>

          <TabsContent value='alerts' className='m-0 focus-visible:outline-none'>
            <ScrollArea className='h-100'>
              <div className='flex flex-col'>
                <AnimatePresence mode='popLayout'>
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <NotificationItem key={n.id} n={n} i={i} markAsRead={markAsRead} />
                    ))
                  ) : (
                    <EmptyStateContainer key='empty-alerts'>
                      <EmptyState
                        icon={<IconBell className='h-8 w-8' />}
                        text='No new notifications'
                      />
                    </EmptyStateContainer>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='messages' className='m-0 focus-visible:outline-none'>
            <ScrollArea className='h-100'>
              <div className='flex flex-col'>
                <AnimatePresence mode='popLayout'>
                  {messages.length > 0 ? (
                    messages.map((m, i) => (
                      <MessageItem key={m.id} m={m} i={i} markMessageRead={markMessageRead} />
                    ))
                  ) : (
                    <EmptyStateContainer key='empty-msgs'>
                      <EmptyState
                        icon={<IconMessage2 className='h-8 w-8' />}
                        text='No new messages'
                      />
                    </EmptyStateContainer>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <div className='bg-muted/20 border-t p-2'>
            <Button
              variant='outline'
              className='hover:bg-primary h-9 w-full gap-2 rounded-xl text-[10px] font-bold tracking-widest uppercase shadow-sm transition-all hover:text-white'
            >
              Management Console <IconExternalLink className='h-3 w-3' />
            </Button>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

// --- Sub-Components with Zustand actions passed as props ---

function NotificationItem({
  n,
  i,
  markAsRead
}: {
  n: NotificationItemType;
  i: number;
  markAsRead: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: -50,
        filter: 'blur(4px)',
        transition: { duration: 0.2, delay: i * 0.03 }
      }}
      onClick={() => markAsRead(n.id)}
      className={cn(
        'border-border/40 hover:bg-muted/50 group relative cursor-pointer border-b p-4 transition-colors',
        !n.read && 'bg-primary/5'
      )}
    >
      <div className='mb-1 flex items-start justify-between'>
        <h5 className='pr-4 text-sm font-semibold'>{n.title}</h5>
        <span className='text-muted-foreground text-[10px] font-medium'>{n.time}</span>
      </div>
      <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>{n.description}</p>
      <div className='mt-3 flex translate-y-1 gap-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100'>
        <Button variant='secondary' size='sm' className='h-6 rounded-md px-2 text-[10px] font-bold'>
          <IconCheck className='mr-1 h-3 w-3' /> Resolve
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-destructive hover:bg-destructive/10 h-6 w-6 rounded-md'
        >
          <IconTrash className='h-3 w-3' />
        </Button>
      </div>
    </motion.div>
  );
}

function MessageItem({
  m,
  i,
  markMessageRead
}: {
  m: MessageItemType;
  i: number;
  markMessageRead: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        x: 50,
        filter: 'blur(4px)',
        transition: { delay: i * 0.03 }
      }}
      onClick={() => markMessageRead(m.id)}
      className='border-border/40 hover:bg-muted/50 group flex cursor-pointer items-center gap-3 border-b p-4 transition-colors'
    >
      <div className='bg-primary/10 border-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border'>
        <span className='text-xs font-bold uppercase'>{m.user[0]}</span>
      </div>
      <div className='min-w-0 flex-1'>
        <div className='mb-0.5 flex items-center justify-between'>
          <p className='truncate text-sm font-semibold'>{m.user}</p>
          <span className='text-muted-foreground text-[10px]'>{m.time}</span>
        </div>
        <p
          className={cn(
            'truncate text-xs',
            m.unread ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}
        >
          {m.preview}
        </p>
      </div>
      {m.unread && (
        <div className='bg-primary h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)]' />
      )}
    </motion.div>
  );
}

function EmptyStateContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
      className='py-20'
    >
      {children}
    </motion.div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className='flex flex-col items-center justify-center px-4 text-center opacity-40'>
      <div className='bg-muted/20 mb-3 rounded-full p-4'>{icon}</div>
      <p className='text-[10px] font-bold tracking-widest uppercase'>{text}</p>
    </div>
  );
}
