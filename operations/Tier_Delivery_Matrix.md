# Tier Delivery Matrix

MedSpa Growth Engine should stay a managed recovery system, not a broad self-serve SaaS. Tiers exist to control scope, delivery load, and dashboard access.

| Capability | Starter / Core | Growth / Standard | Pro / Enterprise |
|---|---:|---:|---:|
| Owner dashboard | Included | Included | Included |
| Revenue leak intake | Included | Included | Included |
| Google Sheet CRM | Included | Included | Included |
| Lead inquiry follow-up | Included | Included | Included |
| Booking confirmation | Included | Included | Included |
| Appointment reminders | Included | Included | Included |
| No-show recovery | Included | Included | Included |
| Review request workflow | Included | Included | Included |
| Referral prompt workflow | Locked | Included | Included |
| VIP/lapsed-client reactivation | Locked | Included | Included |
| Weekly owner report | Basic | Included | Included |
| Daily owner brief | Locked | Included | Included |
| Recovery Assistant | Locked | Limited | Included |
| Advanced analytics | Locked | Limited | Included |
| Monthly campaign recommendation | Locked | Included | Included |
| Ads funnel support | Add-on | Add-on | Optional scoped add-on |
| Multi-location reporting | Not included | Add-on | Scoped add-on |
| Custom booking-system integration | Not included | Add-on | Scoped add-on |

## Subscription Status Behavior

| Status | Dashboard behavior |
|---|---|
| `trialing` | Allow dashboard and show deployment checklist. |
| `active` | Allow tier features. |
| `past_due` | Block advanced actions and show account attention card. |
| `paused` | Read-only access only, no automation actions. |
| `cancelled` | Block dashboard and route to support/book call. |

## Dashboard Gating Rule

A locked feature must show an upgrade card, not a broken button. The user should always understand:

- What is locked.
- Which tier unlocks it.
- How to contact support or book a call.
