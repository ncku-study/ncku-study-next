type DiscordEmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

type DiscordPayload = {
  content: string;
  username: string;
  tts: false;
  embeds: Array<{
    title: string;
    type: 'rich';
    description: string;
    url: string;
    timestamp: string;
    color: number;
    fields: DiscordEmbedField[];
  }>;
};

type CommentNotificationData = {
  category?: unknown;
  rank_1?: unknown;
  rank_2?: unknown;
  year?: unknown;
  score?: unknown;
  out_maj?: unknown;
  in_maj?: unknown;
  comment?: unknown;
  isPass?: unknown;
};

type StudyNotificationData = {
  title?: unknown;
  content?: unknown;
  year?: unknown;
  major?: unknown;
  statistic?: unknown;
  statistics?: unknown;
  otherStatistic?: unknown;
  otherStat?: unknown;
};

function asString(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNamedValueFields(value: unknown, namePrefix = ''): DiscordEmbedField[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (!isRecord(item) || item.name === undefined) return [];
      return [{
        name: `${namePrefix}${asString(item.name)}`,
        value: asString(item.value),
        inline: false,
      }];
    });
  }

  if (isRecord(value)) {
    return Object.entries(value).map(([name, itemValue]) => ({
      name: `${namePrefix}${name}`,
      value: asString(itemValue),
      inline: false,
    }));
  }

  return [];
}

async function postDiscordWebhook(url: string | undefined, payload: DiscordPayload): Promise<void> {
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Discord webhook failed with status ${response.status}`);
    }
  } catch (error) {
    // The notification should not prevent a submitted post from being stored.
    console.error('Discord webhook request failed', error);
  }
}

export async function notifyNewComment(data: CommentNotificationData): Promise<void> {
  const isPass = data.isPass === true || asString(data.isPass) === 'true';
  const payload: DiscordPayload = {
    content: '<@&857153250213756928> 有一則新的[轉雙輔系心得]需要你審查喔!',
    username: '心得審查通知',
    tts: false,
    embeds: [{
      title: `${asString(data.category)} - ${asString(data.in_maj)}`,
      type: 'rich',
      description: asString(data.comment),
      url: '',
      timestamp: new Date().toISOString(),
      color: isPass ? 0x3366ff : 0xd25565,
      fields: [
        { name: '申請年', value: asString(data.year), inline: false },
        { name: '平均分數', value: asString(data.score), inline: false },
        { name: '排名上/下', value: `${asString(data.rank_1)}/${asString(data.rank_2)}`, inline: false },
        { name: '原主修', value: asString(data.out_maj), inline: false },
        { name: '申請結果', value: isPass ? '通過' : '未通過', inline: false },
      ],
    }],
  };

  await postDiscordWebhook(process.env.DISCORD_WEBHOOK_MAJOR, payload);
}

export async function notifyNewStudy(data: StudyNotificationData): Promise<void> {
  const statistic = data.statistic ?? data.statistics;
  const otherStatistic = data.otherStatistic ?? data.otherStat;
  const fields: DiscordEmbedField[] = [
    { name: '申請年', value: asString(data.year), inline: false },
    { name: '主修', value: asString(data.major), inline: false },
    ...toNamedValueFields(statistic),
    ...toNamedValueFields(otherStatistic, '[其他數據] '),
  ];

  const payload: DiscordPayload = {
    content: '<@&857153250213756928> 有一則新的[通用學業心得]需要你審查喔!',
    username: '心得審查通知',
    tts: false,
    embeds: [{
      title: asString(data.title),
      type: 'rich',
      description: asString(data.content),
      url: '',
      timestamp: new Date().toISOString(),
      color: 0xfeda6a,
      fields,
    }],
  };

  await postDiscordWebhook(process.env.DISCORD_WEBHOOK_STUDY, payload);
}
