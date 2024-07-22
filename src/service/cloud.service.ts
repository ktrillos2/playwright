import { KUMONERA_URL } from "@/config";

import ServiceClass from "./ServiceClass";

class KumoneraService extends ServiceClass {
    getImage(path: string) {
        return `${KUMONERA_URL}/cloud/get-img-coupon?path=${path}`
    }

    uploadFile(formData: FormData) {

        return this.postQuery({
            URL: KUMONERA_URL,
            path: '/cloud/save-img-coupon',
            params: {
                typeCoupon: "coupon-detail",
            },
            body: formData,
            hasToken: true
        });

    }
}

export const kumoneraService = new KumoneraService();
