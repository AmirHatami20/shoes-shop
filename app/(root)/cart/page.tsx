import CartLayout from "@/component/cart/CartLayout";
import ProgressStepper from "@/component/ProgressStepper";
import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {authService} from "@/services/authService";

export default async function Page() {
    const token = (await cookies()).get("access_token")?.value
    const userId = token ? verifyToken(token)?.id : null;

    let user = null;
    if (userId) {
        user = await authService.getMe(token as string);
    }

    return (
        <>
            <ProgressStepper currentStep={1}/>
            <CartLayout user={user}/>
        </>
    )
}
