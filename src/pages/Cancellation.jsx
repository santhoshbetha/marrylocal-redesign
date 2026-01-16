import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Clock, CreditCard, RefreshCw } from 'lucide-react';

function Cancellation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-8 border-b border-border flex items-start justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl text-primary">Cancellation Policy</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Our commitment to fair and transparent refund practices</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Last updated on 27-10-2025 08:27:00</span>
          </div>

          {/* Main Policy Statement */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-800">Liberal Cancellation Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MARRYLOCAL believes in helping its users as far as possible, and has therefore a liberal
                  cancellation policy.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Details */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-800">Current Payment Model</h3>
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <p className="text-blue-700 leading-relaxed">
                    Currently there is no monthly subscription payment model in MARRYLOCAL. We will
                    implement low cost payment model in the future if required to run this app.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-orange-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-orange-800">Service Fee Refunds</h3>
                <div className="bg-orange-50/50 border border-orange-200 rounded-lg p-4 space-y-3">
                  <p className="text-orange-700 leading-relaxed">
                    Currently we charge service fees when there are more than 300 matches in your area
                    (city). The amount can be refunded if the payment has been made by mistake and
                    contacted immediately after paying via email not more than 1 day.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>It'll take 3-5 days for the refund to be processed to the end customer.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Need Help?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our cancellation policy or need to request a refund,
              please contact us immediately via email within 1 day of payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Cancellation;
