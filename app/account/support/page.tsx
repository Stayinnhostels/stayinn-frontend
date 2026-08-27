"use client";

import { AccountPage, AccountPageHeader } from "@/components/account/account-page";
import { SupportContactPanel } from "@/components/account/support-contact-panel";

export default function AccountSupportPage() {
  return (
    <AccountPage>
      <AccountPageHeader
        title="Support"
        description="Reach the hostel by WhatsApp, phone, or email. Use the front desk number if you need help right away."
      />
      <SupportContactPanel variant="full" />
    </AccountPage>
  );
}
