interface OrderDetailsDomain {
  orderId: string;
}
export function OrderDetailsDomain(props: OrderDetailsDomain) {
  const { orderId } = props;

  return <div>OrderDetails</div>;
}
