'use client';

// src/app/terms-conditions/page.tsx

import { FileText, AlertCircle, Scale, Lock, Link as LinkIcon } from 'lucide-react';

export default function TermsConditions() {
  const lastUpdated = 'Oct 24, 2025';

  const sections = [
    {
      title: 'Definitions',
      icon: FileText,
      content: `For the purpose of these Terms and Conditions, the term "we", "us", "our" used anywhere on this page shall mean our Marketplace, whose registered/operational office is located in Gurugram, Haryana, India. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.`,
    },
    {
      title: 'Acceptance of Terms',
      icon: Scale,
      content: `Your use of the website and/or purchase from us are governed by these Terms and Conditions. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      title: 'Changes to Terms',
      icon: AlertCircle,
      subsections: [
        'We reserve the right to change these terms and conditions at any time',
        'Changes will be posted on this page with an updated "Last Updated" date',
        'Your continued use of the website constitutes acceptance of the new terms',
        'It is your responsibility to review these terms periodically',
      ],
      content: `We may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are aware of any changes.`,
    },
    {
      title: 'Website Content',
      icon: FileText,
      subsections: [
        'Content is subject to change without notice',
        'We strive for accuracy but do not guarantee completeness',
        'Users are responsible for verifying information independently',
        'We are not liable for any errors or omissions',
      ],
      content: `The content of the pages of this website is subject to change without notice. We do not guarantee the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.`,
    },
    {
      title: 'Disclaimer of Warranties',
      icon: AlertCircle,
      content: `Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.`,
    },
    {
      title: 'Assumption of Risk',
      icon: AlertCircle,
      subsections: [
        'Your use of information or materials on our website is at your own risk',
        'We shall not be liable for any damages arising from such use',
        'You are responsible for verifying products and services meet your requirements',
        'You assume all risks associated with transactions on our platform',
      ],
      content: `Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.`,
    },
    {
      title: 'Intellectual Property Rights',
      icon: Lock,
      subsections: [
        'All design, layout, and graphics are our intellectual property',
        'Reproduction is prohibited without written consent',
        'Unauthorized use may result in legal action',
        'All trademarks are acknowledged on the website',
      ],
      content: `Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.`,
    },
    {
      title: 'Trademarks',
      icon: Lock,
      content: `All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website. Unauthorized use of any information provided by us shall give rise to a claim for damages and/or be a criminal offense.`,
    },
    {
      title: 'External Links',
      icon: LinkIcon,
      subsections: [
        'We may include links to external websites for your convenience',
        'We are not responsible for the content of external websites',
        'External links do not constitute endorsement',
        'You must obtain our prior written consent before linking to our website',
      ],
      content: `From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to our website from another website or document without our prior written consent.`,
    },
    {
      title: 'User Conduct',
      icon: AlertCircle,
      subsections: [
        'You agree not to engage in any conduct that violates these terms',
        'Prohibited activities include harassment, fraud, and misrepresentation',
        'You are responsible for maintaining the security of your account',
        'You agree not to transmit viruses or malicious code',
      ],
      content: `You agree to use this website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content or disrupting the normal flow of dialogue within our website.`,
    },
    {
      title: 'Product Listings and Transactions',
      icon: FileText,
      subsections: [
        'We are a platform, not responsible for buyer-seller disputes',
        'Users are responsible for the accuracy of product information',
        'We reserve the right to remove listings that violate policies',
        'Pricing and availability subject to change without notice',
      ],
      content: `We provide a platform for users to buy and sell products. We do not warrant that product information is accurate or complete. You agree to conduct your own due diligence and assume all risks associated with transactions on our platform.`,
    },
    {
      title: 'Governing Law',
      icon: Scale,
      content: `Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India. The courts in India shall have exclusive jurisdiction over any disputes arising from this agreement.`,
    },
    {
      title: 'Transaction Authorization',
      icon: AlertCircle,
      subsections: [
        'We are not liable for declined transactions',
        'Authorization limits are set with our payment partners',
        'Transaction failures are beyond our control',
        'Contact your bank for transaction-related issues',
      ],
      content: `We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.`,
    },
    {
      title: 'Limitation of Liability',
      icon: AlertCircle,
      subsections: [
        'We are not liable for indirect or consequential damages',
        'Our total liability is limited to the amount paid for services',
        'Some jurisdictions do not allow liability limitations',
        'These limitations apply to the fullest extent permitted by law',
      ],
      content: `To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the services, even if we have been advised of the possibility of such damages.`,
    },
    {
      title: 'Indemnification',
      icon: Scale,
      content: `You agree to indemnify and hold harmless our company and its officers, directors, employees and agents from any and all claims, damages, costs and expenses (including attorney's fees) arising from your use of the website, your violation of these terms and conditions, or your infringement of any third-party rights.`,
    },
    {
      title: 'Termination',
      icon: FileText,
      subsections: [
        'We may terminate or suspend your account at any time',
        'Termination may occur for violation of these terms',
        'Termination may occur for illegal activity',
        'Survival of certain provisions after termination',
      ],
      content: `We may terminate or suspend your account and access to our website immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.`,
    },
    {
      title: 'Entire Agreement',
      icon: FileText,
      content: `These Terms and Conditions constitute the entire agreement between you and us regarding your use of the website and supersede all prior and contemporaneous agreements, whether written or oral, relating to such subject matter.`,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Scale size={32} />
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-purple-100">
            Please read these terms carefully. They contain important information about your legal rights and obligations.
          </p>
          <p className="text-purple-200 text-sm mt-4">
            Last updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Navigation */}
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="text-purple-600 hover:text-purple-700 text-sm p-2 rounded hover:bg-purple-50 transition-colors"
              >
                • {section.title}
              </a>
            ))}
          </div>
        </div> */}

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 flex gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Important</h3>
            <p className="text-red-800 text-sm">
              By using our website and services, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions listed below.
            </p>
          </div>
        </div>

        {/* Terms & Conditions Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                id={`section-${index}`}
                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border-l-4 border-purple-600"
              >
                {/* Section Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                    <Icon className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {index + 1}. {section.title}
                    </h2>
                  </div>
                </div>

                {/* Section Content */}
                <p className="text-gray-700 leading-relaxed mb-4 ml-16">
                  {section.content}
                </p>

                {/* Subsections if any */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600 ml-16">
                    <ul className="space-y-3">
                      {section.subsections.map((subsection, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-purple-600 font-bold text-lg mt-0">→</span>
                          <span className="text-gray-700">{subsection}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Information Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions or concerns about these Terms and Conditions, or if you believe your rights have been violated, please contact us at your earliest convenience.
          </p>

          <div className="bg-white rounded-lg p-6 border border-purple-200">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">Email:</p>
                <a 
                  href="mailto:olditemss@gmail.com"
                  className="text-purple-600 hover:text-purple-700"
                >
                 olditemss@gmail.com
                </a>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phone:</p>
                <a 
                  href="tel:+919838824898"
                  className="text-purple-600 hover:text-purple-700"
                >
                  +919838824898
                </a>
              </div>
              {/* <div>
                <p className="font-semibold text-gray-900">Address:</p>
                <p className="text-gray-700">Gurugram, Haryana, India</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Acknowledgment</h3>
          <p className="text-gray-700 text-sm mb-3">
            By accessing and using this website, you acknowledge that you have read and understood these Terms and Conditions in their entirety.
          </p>
          <p className="text-gray-700 text-sm">
            If you do not agree with any part of these terms, you must discontinue using our website and services immediately. Your continued use of the website constitutes your acceptance of these terms and any updates made to them.
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600 text-sm border-t pt-8">
          <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
          <p className="mt-2">These Terms and Conditions were last updated on {lastUpdated}</p>
          <p className="mt-4 text-gray-500">
            <a href="/privacy-policy" className="text-purple-600 hover:text-purple-700">
              View our Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}