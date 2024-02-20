import { LoggerComponent } from "@/components";
import { CouponsScraperTable } from "@/modules";

enum LogType {
  INFO = "INFO",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

enum LogCategory {
  COUPON = "COUPON",
}

// interface para messages 
interface LogMessage {
  type: LogType;
  category: LogCategory;
  message: string;
  date: string;
}

const messages: LogMessage[]= [
  {
    type: LogType.INFO,
    category: LogCategory.COUPON,
    message: "This page is for scraping coupons from the web.",
    date: "11:40:12"
  },
  {
    type: LogType.SUCCESS,
    category: LogCategory.COUPON,
    message: "Scraping complete.",
    date: "11:40:12"
  },
  {
    type: LogType.ERROR,
    category: LogCategory.COUPON,
    message: "Scraping failed.",
    date: "11:40:12"
  },
  {
    type: LogType.WARNING,
    category: LogCategory.COUPON,
    message: "Scraping incomplete.",
    date: "11:40:12"
  },
];

export default function CouponsScraperPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CouponsScraperTable />
      <LoggerComponent messages={messages} />
    </div>
  );
}
