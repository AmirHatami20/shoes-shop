import CartLayout from "@/component/cart/CartLayout";
import ProgressStepper from "@/component/ProgressStepper";

export default async function Page() {

    return (
        <>
            <ProgressStepper currentStep={1}/>
            <CartLayout/>
        </>
    )
}
