'use client'
import { useState, useEffect } from 'react';
import { LoggerComponent } from "@/components/ui/buttons";
import { generalService } from "@/service";
import { LogMessage } from '@/interfaces';
import { CouponsScraperTable } from '@/modules/coupons/scraper/CouponsScraperTable';
import { CouponsScraperMultiSelect } from '@/modules/coupons/scraper/CouponsScraperMultiSelect';

export default function CouponsScraperPage() {
  const [messages, setMessages] = useState<LogMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await generalService.getLogMessagesByCategory("COUPON");
      setMessages(result);
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex gap-4">
      <CouponsScraperMultiSelect />
      {/* <LoggerComponent messages={messages} /> */}
    </div>
  );
}