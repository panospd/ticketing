import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import "prop-types";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id,
        },
        onSuccess: (payment) => console.log(payment),
    });

    useEffect(() => {
        const fineTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        fineTimeLeft();
        const timerId = setInterval(fineTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    if (timeLeft < 0) {
        return <div>Order Expired</div>;
    }

    const msLeft = new Date(order.expiresAt) - new Date();
    return (
        <div>
            Time left to pay: {timeLeft}
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51Hy0kHFFbifH2CjDpb6ps1NhAJTzhM0Q1BxNTmQpwAN42lcSEqW2IAJz5fdxGplzlbwMjtfkycpzcamNxLwHm2uA00VyJgy8qX"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};

OrderShow.getInitialProps = async (ctx, client) => {
    const { orderId } = ctx.query;

    console.log("my id", orderId);

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;
