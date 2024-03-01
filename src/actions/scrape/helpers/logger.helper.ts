import { LogCategory, LogType } from "@/interfaces";
import { dbConnect, logMessageService } from "@/lib";
import { revalidatePath } from "next/cache";

export const logger = async (type: LogType, message: string, error?: any) => {
	await dbConnect();
	const response = await logMessageService.createLogMessage({
		category: LogCategory.COUPON,
		type,
		message,
		error,
	});

	revalidatePath("/coupons/scraper");

	return response;
};
