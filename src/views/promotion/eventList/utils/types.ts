interface EventIdItem {
  id: number;
  game_display_name: string;
  game_event_id: string;
}

interface EventItem {
  id: number;
  promoEventID: string;
  promoGameID: string;
  note: string;
  eventStartTime: string;
  eventEndTime: string;
  eventID: EventIdItem[];
  score: number;
  status: number;
  updatedAt: string;
  updatedUser: string;
}

/** 賽事新增/編輯表單 */
interface FormItemProps {
  promoEventID: string;
  promoGameID: string;
  note: string;
  status: number;
  eventStartTime: string;
  eventEndTime: string;
}

interface FormProps {
  formInline: FormItemProps;
}

/** 總積分編輯表單 */
interface ScoreFormItemProps {
  promoEventID: string;
  promoGameID: string;
  score: number;
}

interface ScoreFormProps {
  formInline: ScoreFormItemProps;
}

export type {
  EventIdItem,
  EventItem,
  FormItemProps,
  FormProps,
  ScoreFormItemProps,
  ScoreFormProps
};
