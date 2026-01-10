import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export function Cancellation() {
  return (
    <div className="flex justify-center">
      <Card className="w-[95%] max-w-7xl shadow-md border-border/50 mx-4 rounded-none mt-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Cancellation</CardTitle>
        </CardHeader>
        <div className="flex flex-col space-y-2 mx-6 text-lg">
          <p className="font-bold">Last updated on 27-10-2025 08:27:00</p>
          <p>
            MARRYLOCAL believes in helping its users as far as possible, and has therefore a liberal
            cancellation policy.
          </p>
          <h6 className="font-bold">Under this policy:</h6>
          <ul className="">
            <li>
              Currently there is no monthly subscription payment model in MARRYLOCAL.We will
              implement low cost payment model in the future if required to run this app.
            </li>
            <li>
              Currenlty we charge service fees when there are more than 300 matches in your area
              (city). The amount can be refunded if the payment has been made by mistake and
              contacted immediately after paying via email not more than 1 day.
            </li>
            <li>It’ll take 3-5 Days days for the refund to be processed to the end customer.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
