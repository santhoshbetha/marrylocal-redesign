import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Clock, Shield, AlertTriangle, Mail } from 'lucide-react';

export function Terms() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-8 border-b border-border flex items-start justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl text-primary">Terms and Conditions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Legal terms governing your use of MarryLocal services</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Last updated on 27-10-2025 19:25:00</span>
          </div>

          {/* Introduction */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions, along with privacy policy or other terms ("Terms")
                  constitute a binding agreement by and between MarryLocal.in and you and relate to your
                  use of our website.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using our website and availing the Services, you agree that you have read and
                  accepted these Terms (including the Privacy Policy). We reserve the right to modify
                  these Terms at any time and without assigning any reason. It is your responsibility to
                  periodically review these Terms to stay informed of updates.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Age Restriction</span>
                  </div>
                  <p className="text-red-700 mt-2">This site is not for anyone under the age of 18 years.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Terms of Use */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-800">Terms of Use</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The use of this website or availing of our Services is subject to the following terms of use:
                </p>
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="text-green-700 leading-relaxed">
                    To access and use the Services, you agree to provide true, accurate and complete
                    information to us during and after registration, and you shall be responsible for all
                    acts done through the use of your registered account.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    Your use of our Services and the website is solely at your own risk and discretion..
                    You are required to independently assess and ensure that the Services meet your
                    requirements.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    The contents of the Website and the Services are proprietary to Us and you will not
                    have any authority to claim any intellectual property rights, title, or interest in
                    its contents.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    You agree to pay us the charges associated with availing the Services.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    You acknowledge that unauthorized use of the Website or the Services may to action
                    against you as per these Terms or applicable laws.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    You understand that upon initiating a transaction for availing the Services you are
                    entering into a legally binding and enforceable contract with the us for the Services.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    You shall be entitled to claim a refund of the payment made by you in case we are not
                    able to provide the Service. The timelines for such return and refund will be
                    according to the specific Service you have availed or within the time period provided
                    in our policies (as applicable). In case you do not raise a refund claim within the
                    stipulated time, than this would make you ineligible for a refund.
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    All concerns or communications relating to these Terms must be communicated to us
                    using the contact information provided on this website.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* User Conduct */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-800">User Conduct</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All users of the Site shall refrain from any and all conduct that is:
                </p>
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="text-blue-700 leading-relaxed">
                    Unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive,
                    fraudulent, invasive of another person's privacy, tortious, contains explicit or
                    graphic depictions or accounts of sexual acts, or otherwise violates our rules or
                    policies.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Posting inappropriate content like adult content or explicit adult material in your
                    profile.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Posting any ad for products or services in the bio, use or sale of which is
                    prohibited by any law or regulation.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Using any automated device, spider, robot, crawler, data mining tool, software or
                    routine to access, copy, or download any part of the Site.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Taking any action creating a disproportionately large usage load on the Site.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Posting any employment ads in the bio, violating the anti-discrimination provisions of
                    the Immigration and Nationality Act or messages which violate any law or regulation.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Using the Site to engage in or assist another individual or entity to engage in
                    fraudulent, abusive, manipulative or illegal activity.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Posting free ads promoting links to commercial services or web sites except in areas
                    of the Site where such ads are expressly permitted.
                  </div>
                  <div className="text-blue-700 leading-relaxed">
                    Posting any material advertising weapons the use, carrying, or advertising of
                    which is prohibited by law in the bio info.
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800 font-medium">
                    <Mail className="w-4 h-4" />
                    <span>Report Violations</span>
                  </div>
                  <p className="text-orange-700 mt-2">
                    Please report any violations of these Terms to:{' '}
                    <span className="font-semibold">contact@marrylocal.in</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
