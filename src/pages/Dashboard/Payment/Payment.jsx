import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router";
import PaymentForm from "./PaymentForm";

const Payment = () => {
  const { id } = useParams();
  console.log(id);

  const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
