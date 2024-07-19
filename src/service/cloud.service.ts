import { KUMONERA_URL } from "@/config";

import ServiceClass from "./ServiceClass";

class KumoneraService extends ServiceClass {
    getImage(path: string) {
        return `${KUMONERA_URL}/cloud/get-img-coupon?path=${path}`
    }
}

export const kumoneraService = new KumoneraService();
