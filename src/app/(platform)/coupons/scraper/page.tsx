
import { CouponsScraperMultiSelect } from '@/modules/coupons/scraper';

export default function CouponsScraperPage() {
  // const [messages, setMessages] = useState<LogMessage[]>([]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     const result = await generalService.getLogMessagesByCategory("COUPON");
  //     setMessages(result);
  //   };

  //   fetchMessages();
  // }, []);

  return (
    <div className="flex gap-4">
      <CouponsScraperMultiSelect />
      {/* <LoggerComponent messages={messages} /> */}
    </div>
  );
}