import React from 'react';
import ProgressStepper from "@/component/ProgressStepper";
import CheckoutLayout from "@/component/checkout/CheckoutLayout";

export default async function Page() {
    return (
        <>
            <ProgressStepper currentStep={2}/>
            <CheckoutLayout/>
        </>
    );
}