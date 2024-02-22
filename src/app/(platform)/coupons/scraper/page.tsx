'use client'
import { useState, useEffect } from 'react';
import { LoggerComponent } from "@/components";
import { generalService } from "@/service";
import { LogMessage } from '@/interfaces';
import { CouponsScraperTable } from '@/modules/coupons/scraper/CouponsScraperTable';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CouponsScraperTable />
      <LoggerComponent messages={messages} />
    </div>
  );
}