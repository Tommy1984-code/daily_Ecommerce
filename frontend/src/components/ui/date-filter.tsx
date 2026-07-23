import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Calendar } from "lucide-react";

export type DatePreset =
  | "today"
  | "yesterday"
  | "this-week"
  | "this-month"
  | "last-month"
  | "custom";

export interface DateFilterValue {
  preset: DatePreset;
  dateFrom: string;
  dateTo: string;
}

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

const presetLabels: Record<DatePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "this-week": "This Week",
  "this-month": "This Month",
  "last-month": "Last Month",
  custom: "Custom Range",
};

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeRange(preset: DatePreset, customFrom?: string, customTo?: string): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "today": {
      const d = formatDate(today);
      return { dateFrom: d, dateTo: d };
    }
    case "yesterday": {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      const ds = formatDate(d);
      return { dateFrom: ds, dateTo: ds };
    }
    case "this-week": {
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      return { dateFrom: formatDate(monday), dateTo: formatDate(today) };
    }
    case "this-month":
      return {
        dateFrom: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        dateTo: formatDate(today),
      };
    case "last-month": {
      const firstOfLast = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastOfLast = new Date(today.getFullYear(), today.getMonth(), 0);
      return { dateFrom: formatDate(firstOfLast), dateTo: formatDate(lastOfLast) };
    }
    case "custom":
      return {
        dateFrom: customFrom || formatDate(today),
        dateTo: customTo || formatDate(today),
      };
  }
}

export function getTodayFilter(): DateFilterValue {
  const range = computeRange("today");
  return { preset: "today", ...range };
}

export function DateFilter({ value, onChange }: DateFilterProps) {
  const isCustom = value.preset === "custom";

  const handlePresetChange = (preset: DatePreset) => {
    const r = computeRange(preset, value.dateFrom, value.dateTo);
    onChange({ preset, ...r });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select value={value.preset} onValueChange={(v: string) => handlePresetChange(v as DatePreset)}>
        <SelectTrigger className="h-8 w-[150px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(presetLabels).map(([key, label]) => (
            <SelectItem key={key} value={key} className="text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isCustom && (
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={value.dateFrom}
            onChange={(e) => onChange({ preset: "custom", dateFrom: e.target.value, dateTo: value.dateTo })}
            className="h-8 w-36 text-xs"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <Input
            type="date"
            value={value.dateTo}
            onChange={(e) => onChange({ preset: "custom", dateFrom: value.dateFrom, dateTo: e.target.value })}
            className="h-8 w-36 text-xs"
          />
        </div>
      )}
    </div>
  );
}
