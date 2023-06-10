import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState(0);

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
    return <div>Time left to pay: {timeLeft}</div>;
};

OrderShow.getInitialProps = async (ctx, client) => {
    const { orderId } = ctx.query;

    console.log("my id", orderId);

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;
