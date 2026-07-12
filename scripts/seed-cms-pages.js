/**
 * Seed script: Creates the 6 default CMS pages if they don't already exist.
 * Run with: node scripts/seed-cms-pages.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    metaDescription: { type: String, trim: true, default: '' },
    content: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CmsPage = mongoose.models.CmsPage || mongoose.model('CmsPage', CmsPageSchema);

const pages = [
  {
    slug: 'contact',
    title: 'Contact Us',
    metaDescription: 'Get in touch with the BLAK BLAZE team.',
    content: `<h2>Get In Touch</h2>
<p>We'd love to hear from you. Whether you have a question about your order, a product, or anything else — our team is here to help.</p>
<h3>Email</h3>
<p><a href="mailto:support@blakblaze.com">support@blakblaze.com</a></p>
<h3>Phone</h3>
<p>+91 98765 43210 (Mon–Sat, 10am–7pm IST)</p>
<h3>Response Time</h3>
<p>We typically respond within <strong>24 hours</strong> on business days.</p>`,
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    metaDescription: 'Answers to common questions about orders, shipping, and returns at BLAK BLAZE.',
    content: `<h2>General</h2>
<h3>How do I track my order?</h3>
<p>Once your order is shipped, you'll receive a tracking link via email and SMS. You can also check order status in <strong>My Account → Orders</strong>.</p>
<h3>Can I change or cancel my order?</h3>
<p>Orders can be cancelled within <strong>24 hours</strong> of placement. After that, orders may already be packed and cannot be changed.</p>
<h2>Shipping</h2>
<h3>How long does delivery take?</h3>
<p>Standard delivery: <strong>4–7 business days</strong>. Express delivery: <strong>2–3 business days</strong>.</p>
<h3>Is there free shipping?</h3>
<p>Yes! Orders above <strong>₹999</strong> qualify for free standard shipping.</p>
<h2>Returns</h2>
<h3>What is your return policy?</h3>
<p>We accept returns within <strong>7 days</strong> of delivery for unworn, unwashed items with original tags intact.</p>`,
  },
  {
    slug: 'shipping',
    title: 'Shipping Info',
    metaDescription: 'Learn about our shipping options, timelines, and policies at BLAK BLAZE.',
    content: `<h2>Shipping Policy</h2>
<p>At BLAK BLAZE, we strive to get your order to you as quickly as possible.</p>
<h3>Delivery Timelines</h3>
<ul>
  <li><strong>Metro cities:</strong> 2–4 business days</li>
  <li><strong>Other cities:</strong> 4–7 business days</li>
  <li><strong>Remote areas:</strong> 7–10 business days</li>
</ul>
<h3>Shipping Charges</h3>
<ul>
  <li>Free shipping on orders above ₹999</li>
  <li>₹75 flat shipping fee on orders below ₹999</li>
</ul>
<h3>Order Processing</h3>
<p>Orders are processed within <strong>24–48 hours</strong> of placement (excluding Sundays and public holidays).</p>
<h3>Tracking</h3>
<p>A tracking link is sent via email and SMS once your order is dispatched. You can also track from <strong>My Account → Orders</strong>.</p>`,
  },
  {
    slug: 'returns',
    title: 'Returns & Exchanges',
    metaDescription: 'Understand our 7-day return and exchange policy at BLAK BLAZE.',
    content: `<h2>Returns Policy</h2>
<p>Your satisfaction is our priority. If you're not 100% happy with your purchase, we'll make it right.</p>
<h3>Return Window</h3>
<p>Returns are accepted within <strong>7 days</strong> of delivery.</p>
<h3>Eligibility</h3>
<ul>
  <li>Items must be unworn, unwashed, and in original condition</li>
  <li>Original tags must be intact</li>
  <li>Items must be in original packaging</li>
</ul>
<h3>Non-Returnable Items</h3>
<ul>
  <li>Innerwear and swimwear (hygiene reasons)</li>
  <li>Items purchased on clearance / final sale</li>
</ul>
<h3>Refund Process</h3>
<p>Once your returned item is received and inspected, your refund will be processed within <strong>5–7 business days</strong> to your original payment method.</p>
<h3>How to Initiate a Return</h3>
<p>Go to <strong>My Account → Orders</strong>, select the item, and click <strong>Request Return</strong>. Our team will arrange a pickup.</p>`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    metaDescription: 'How BLAK BLAZE collects, uses, and protects your personal data.',
    content: `<h2>Privacy Policy</h2>
<p><em>Last updated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
<p>At BLAK BLAZE, we take your privacy seriously. This policy explains how we collect, use, and protect your information.</p>
<h3>Information We Collect</h3>
<ul>
  <li>Name, email address, and phone number when you register</li>
  <li>Shipping and billing addresses</li>
  <li>Order and payment history</li>
  <li>Browsing behaviour on our website (via cookies)</li>
</ul>
<h3>How We Use Your Information</h3>
<ul>
  <li>To process and fulfil your orders</li>
  <li>To send order updates and delivery notifications</li>
  <li>To improve our website and product offerings</li>
  <li>To send promotional emails (you can unsubscribe anytime)</li>
</ul>
<h3>Data Security</h3>
<p>We use industry-standard encryption (SSL) to protect your data. We never sell or share your personal information with third parties for marketing.</p>
<h3>Cookies</h3>
<p>We use cookies to improve your browsing experience. You can disable cookies in your browser settings, though some features may not function correctly.</p>
<h3>Contact</h3>
<p>For privacy-related queries, email us at <a href="mailto:privacy@blakblaze.com">privacy@blakblaze.com</a>.</p>`,
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    metaDescription: 'Read the Terms of Service for using the BLAK BLAZE platform.',
    content: `<h2>Terms of Service</h2>
<p><em>Last updated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
<p>By accessing or using the BLAK BLAZE website, you agree to the following terms.</p>
<h3>Use of the Website</h3>
<ul>
  <li>You must be at least 18 years old to make a purchase</li>
  <li>You agree not to misuse the platform or attempt to compromise its security</li>
  <li>All product information is provided in good faith and may be subject to change</li>
</ul>
<h3>Pricing</h3>
<p>All prices are in Indian Rupees (INR) and inclusive of applicable taxes. Prices may change without notice.</p>
<h3>Orders</h3>
<p>An order confirmation does not constitute a binding contract until we confirm dispatch. We reserve the right to cancel orders in cases of pricing errors or stock unavailability.</p>
<h3>Intellectual Property</h3>
<p>All content on this website, including images, text, and branding, is the property of BLAK BLAZE and may not be reproduced without permission.</p>
<h3>Limitation of Liability</h3>
<p>BLAK BLAZE shall not be liable for any indirect or consequential damages arising from the use of our website or products.</p>
<h3>Governing Law</h3>
<p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in [Your City], India.</p>
<h3>Contact</h3>
<p>For legal inquiries: <a href="mailto:legal@blakblaze.com">legal@blakblaze.com</a></p>`,
  },
];

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI not found in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  let created = 0;
  let skipped = 0;

  for (const page of pages) {
    const existing = await CmsPage.findOne({ slug: page.slug });
    if (existing) {
      console.log(`⏭   Skipped /${page.slug} (already exists)`);
      skipped++;
    } else {
      await CmsPage.create({ ...page, isPublished: true });
      console.log(`✅  Created /${page.slug}`);
      created++;
    }
  }

  console.log(`\n🎉  Done — ${created} created, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
