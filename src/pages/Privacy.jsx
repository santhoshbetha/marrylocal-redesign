import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Clock, Eye, Database, Users, Lock, Mail, AlertTriangle } from 'lucide-react';

function Privacy() {
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
              <CardTitle className="text-2xl text-primary">Privacy Policy</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">How we protect and handle your personal information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Last updated on 27-10-2025 11:11:11</span>
          </div>

          {/* Introduction */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  This privacy policy ("Policy") relates to the manner MarryLocal.in in which we use,
                  handle and process the data that you provide us in connection with using the
                  products or services we offer. By using this website or by availing goods or
                  services offered by us, you agree to the terms and conditions of this Policy, and
                  consent to our use, storage, disclosure, and transfer of your information or data in
                  the manner described in this Policy.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to ensuring that your privacy is protected in accordance with
                  applicable laws and regulations. We urge you to acquaint yourself with this Policy
                  to familiarize yourself with the manner in which your data is being handled by us.
                </p>
              </div>
            </div>
          </div>
          {/* Data Collection */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-800">What data is being collected</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may collect the following information from you:
                </p>
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-4 space-y-2">
                  <div className="text-green-700 leading-relaxed">• Name</div>
                  <div className="text-green-700 leading-relaxed">• Contact information including phone number and email address</div>
                  <div className="text-green-700 leading-relaxed">• Demographic information or preferences or interests</div>
                  <div className="text-green-700 leading-relaxed">• Personal Data or Other information relevant/required for providing the goods or services to you</div>
                  <div className="text-green-700 leading-relaxed">• The meaning of Personal Data will be as defined under relevant Indian laws</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Important Note</span>
                  </div>
                  <p className="text-orange-700 mt-2 leading-relaxed">
                    Notwithstanding anything under this Policy as required under applicable Indian laws,
                    we will not be storing any credit card, debit card or any other similar card data of yours.
                    Please also note that all data or information collected from you will be strictly in
                    accordance with applicable laws and guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Data Usage */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-800">What we do with the data we gather</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We require this data to provide you with the goods or services offered by us including
                  but not limited, for the below set out purposes:
                </p>
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="text-blue-700 leading-relaxed">• Internal record keeping</div>
                  <div className="text-blue-700 leading-relaxed">• For improving our products or services</div>
                  <div className="text-blue-700 leading-relaxed">• For providing updates to you regarding our products or services including any special offers</div>
                  <div className="text-blue-700 leading-relaxed">• To communicate information to you</div>
                </div>
              </div>
            </div>
          </div>
          {/* Data Sharing */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-800">Who do we share your data with</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may share your information or data with:
                </p>
                <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-4">
                  <div className="text-purple-700 leading-relaxed">
                    Governmental bodies, regulatory authorities, law enforcement authorities pursuant
                    to our legal obligations or compliance requirements.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* User Rights */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-indigo-800">Your rights relating to your data</h3>
                <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="font-medium text-indigo-800">Right to Review</div>
                    <p className="text-indigo-700 leading-relaxed">
                      You can review the data provided by you and can request us to correct or amend such
                      data (to the extent feasible, as determined by us). That said, we will not be responsible
                      for the authenticity of the data or information provided by you.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-indigo-800">Withdrawal of your consent</div>
                    <p className="text-indigo-700 leading-relaxed">
                      You can choose not to provide your data, at any time while availing our goods or services
                      or otherwise withdraw your consent provided to us earlier, in writing to our email ID:
                      contact@marrylocal.in In the event you choose to not provide or later withdraw your consent,
                      we may not be able to provide you our services or goods. Please note that these rights are
                      subject to our compliance with applicable laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-teal-800">How long will we retain your information or data?</h3>
                <div className="bg-teal-50/50 border border-teal-200 rounded-lg p-4">
                  <p className="text-teal-700 leading-relaxed">
                    We may retain your information or data (i) for as long as we are providing goods and
                    services to you; and (ii) as permitted under applicable law, we may also retain your
                    data or information even after you terminate the business relationship with us.
                    However, we will process such information or data in accordance with applicable laws
                    and this Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Data Security */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-800">Data Security</h3>
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 leading-relaxed">
                    We will use commercially reasonable and legally required precautions to preserve the
                    integrity and security of your information and data.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-orange-800">Queries/ Grievance Officer</h3>
                <div className="bg-orange-50/50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-700 leading-relaxed">
                    For any queries, questions or grievances about this Policy, please contact us using
                    the contact information provided on this website.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Acceptance and Additional Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-800">Acceptance of Privacy Policy</h3>
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-4 space-y-3">
                  <p className="text-green-700 leading-relaxed">
                    Each time you access, use, upload info, photos, or browse profiles in the site, you
                    signify your acceptance of the then-current Privacy Policy. If you do not accept this
                    Privacy Policy, you are not authorized to use the Site and must discontinue use of the
                    Site immediately.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Age Restriction</span>
                    </div>
                    <p className="text-red-700 mt-2">The Site is not for anyone under the age of 18 and does not knowingly collect personal information from individuals under 18.</p>
                  </div>
                  <p className="text-green-700 leading-relaxed">
                    We understand that storing data in a secure manner is important. We store personal
                    information using industry standard, reasonable and technically feasible, physical,
                    technical and administrative safeguards against foreseeable risks, such as unauthorized access.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 leading-relaxed">
                      Please be aware that the Site and data storage are run on software, hardware and
                      networks, any component of which may, from time to time, require maintenance or
                      experience problems or breaches of security beyond the Site's control. We cannot
                      guarantee the security of the information on and sent from the Site.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Changes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-800">Policy Changes and Acceptance</h3>
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 leading-relaxed">
                    The Privacy Policy may be revised from time to time as we add new features and
                    services, as industry privacy and security best practices evolve. We display an
                    effective date on the Privacy Policy so that it will be easier for you to know when
                    there has been a change. Accordingly, you should check the Privacy Policy on a
                    regular basis for the most current privacy practices. Each time you access, use or
                    browse the Site, you signify your acceptance of the then-current changes to the
                    Privacy Policy applying to your personal information collected by us on and from the
                    effective date of such changes.
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

export default Privacy;
