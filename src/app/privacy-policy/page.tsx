'use client';

// src/app/privacy-policy/page.tsx

import { Shield, Mail, MapPin, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'Oct 24, 2025';

  const sections = [
    {
      title: 'Introduction',
      content: `This privacy policy sets out how our Marketplace uses and protects any information that you provide when you visit our website and/or agree to purchase from us. We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement.`,
    },
    {
      title: 'Changes to This Policy',
      content: `We may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes. Your continued use of our website following the posting of revised Privacy Policy means that you accept and agree to the changes.`,
    },
    {
      title: 'Information We Collect',
      subsections: [
        'Name and contact information including email address',
        'Demographic information such as postcode, preferences and interests',
        'Information about your transactions and purchase history',
        'Survey responses and feedback',
        'Device information and browsing behavior',
      ],
      content: `We may collect the following information to provide you with better service and understand your needs.`,
    },
    {
      title: 'How We Use Your Information',
      subsections: [
        'Internal record keeping and account management',
        'Improving our products and services',
        'Sending promotional emails about new products, special offers or information',
        'Conducting market research and surveys',
        'Personalizing your website experience',
        'Processing transactions and sending confirmations',
        'Responding to customer inquiries and providing support',
      ],
      content: `We use the information we gather to understand your needs and provide you with a better service.`,
    },
    {
      title: 'Data Security',
      content: `We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have implemented suitable physical, electronic and managerial measures. Your personal information is kept secure and is protected by appropriate safeguards.`,
    },
    {
      title: 'Cookies',
      subsections: [],
      content: `A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.`,
    },
    {
      title: 'Controlling Your Personal Information',
      subsections: [
        'You can request not to receive marketing communications',
        'You can update or correct your personal information at any time',
        'You can request deletion of your account and associated data',
        'You have the right to access the information we hold about you',
      ],
      content: `You may choose to restrict the collection or use of your personal information in the following ways.`,
    },
    {
      title: 'Sharing Your Information',
      content: `We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.`,
    },
    {
      title: 'Your Rights',
      subsections: [
        'Right to access: You can request access to the personal data we hold about you',
        'Right to correction: You can request that incorrect or incomplete data be corrected',
        'Right to deletion: You can request deletion of your data',
        'Right to withdraw consent: You can withdraw consent at any time',
      ],
      content: `You have certain rights regarding your personal information.`,
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'olditemss@gmail.com',
      link: 'mailto:olditemss@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 9838824898',
      link: 'tel:+919838824898',
    },
    // {
    //   icon: MapPin,
    //   title: 'Address',
    //   value: 'Gurugram, Haryana, India',
    //   link: '#',
    // },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#54CEBD] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={32} />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-white">
            Your privacy is important to us. This page explains how we collect, use, and protect your information.
          </p>
          <p className="text-white text-sm mt-4">
            Last updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Navigation */}
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="text-[#E06B2D] hover:text-blue-700 text-sm p-2 rounded hover:bg-blue-50 transition-colors"
              >
                • {section.title}
              </a>
            ))}
          </div>
        </div> */}

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              id={`section-${index}`}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              {/* Section Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                  <div className="w-6 h-6 bg-[#E06B2D] rounded flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>

              {/* Section Content */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {section.content}
              </p>

              {/* Subsections if any */}
              {section.subsections && section.subsections.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <ul className="space-y-3">
                    {section.subsections.map((subsection, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#E06B2D] font-bold mt-1">✓</span>
                        <span className="text-gray-700">{subsection}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions or Corrections?</h2>
          <p className="text-gray-700 mb-6">
            If you believe that any information we are holding on you is incorrect or incomplete, 
            or if you have questions about our privacy practices, please contact us as soon as possible. 
            We will promptly correct any information found to be incorrect.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.link}
                  className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="text-black" size={24} />
                    <h3 className="font-semibold text-gray-900">{method.title}</h3>
                  </div>
                  <p className="text-black text-sm break-all">
                    {method.value}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Important Notice</h3>
          <p className="text-gray-700 text-sm mb-3">
            This privacy policy is designed to keep you informed about how we collect and use your data. 
            We are committed to protecting your privacy and ensuring you have a positive experience on our website.
          </p>
          <p className="text-gray-700 text-sm">
            If you do not agree with this privacy policy, please do not use our website. Your continued 
            use of the website following the posting of changes to this policy means you accept those changes.
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
          <p className="mt-2">This privacy policy was last updated on {lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}